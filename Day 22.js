const fs = require('fs');
const { on } = require('stream');
const input = fs.readFileSync('../day22input.txt',{ encoding: 'utf8', flag: 'r' });

const splitregex = /(on|off|[-]{0,1}\d+)/g
const lines = input.split(/[\r\n]+/).map((x)=>x.match(splitregex).map((y,yidx)=>yidx>0?parseInt(y):y)).map((z,zx)=>{return[zx,z[0],z.slice(1)]})


// From https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
function* cartesian(head, ...tail) {
    const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
    for (let r of remainder) for (let h of head) yield [h, ...r];
}

function getVolume(coOrds){
    let [x1,x2,y1,y2,z1,z2] = coOrds
    return (Math.abs((x2 - x1))+1)*(Math.abs((y2 - y1))+1)*(Math.abs((z2 - z1))+1)
}

function testOverlap(range1,range2){
    let [x1,x2,y1,y2,z1,z2] = range1
    let [bx1,bx2,by1,by2,bz1,bz2] = range2
    return Math.max(x1,bx1) <= Math.min(x2,bx2) && Math.max(y1,by1) <= Math.min(y2,by2) && Math.max(z1,bz1) <= Math.min(z2,bz2)
}

function testSuperset(cubes1,cubes2){
    let [x1,x2,y1,y2,z1,z2] = cubes1
    let [bx1,bx2,by1,by2,bz1,bz2] = cubes2
    if(testOverlap(cubes1,cubes2)){
        return [[x1<=bx1 && bx2 <=x2,y1<=by1 && by2 <=y2,z1<=bz1 && bz2 <=z2].every((x)=>x === true),[bx1<=x1 && x2 <=bx2,by1<=y1 && y2 <=by2,bz1<=z1 && z2 <=bz2].every((x)=> x === true)]
    } else {
        return [false,false]
    }
}

function getOverlap(cubes1,cubes2){
    let [x1,x2,y1,y2,z1,z2] = cubes1
    let [bx1,bx2,by1,by2,bz1,bz2] = cubes2

    if(testOverlap(cubes1,cubes2)){
        let overlapping = [Math.max(x1,bx1),Math.min(x2,bx2),Math.max(y1,by1),Math.min(y2,by2),Math.max(z1,bz1),Math.min(z2,bz2)]

        return [testSuperset([x1,x2,y1,y2,z1,z2],[bx1,bx2,by1,by2,bz1,bz2]),
                [getVolume(overlapping)],
                [overlapping]].flatMap((x)=>x)
        
    } else {
        return []
    }
}

function intervals(start,end){
    let s = start.slice()
    let e = end.slice()
    let i1 = s.shift()
    let result = []
    while(s.length>0||e.length>0){
        let nextStart = s[0]
        let nextEnd = e[0]

        if(nextStart<=nextEnd || nextEnd === undefined){
            result.push([i1,nextStart-1])
            i1 = s.shift()
        } else {
            result.push([i1,e.shift()])
            i1 = nextEnd+1
        }
    }
    return result
}

// Part 1
let p1steps = {}

lines.filter(([ix,el,vals])=>vals.every((x)=>-50<=x && x<=50)).forEach((line)=>{
    let [ind,action,[x1,x2,y1,y2,z1,z2]] = line

    for(i=x1;i<=x2;i++){
        for(j=y1;j<=y2;j++){
            for(k=z1;k<=z2;k++){
                if(action === 'on'){
                    p1steps[`${i}_${j}_${k}`] = 'on'
                } else {
                    p1steps[`${i}_${j}_${k}`] = 'off'
                }
            }
        }
    }
})

let p1Total = Object.values(p1steps).filter((x)=>x === 'on').length 
console.log(p1Total) // Part 1 answer

// Part 2

let p2lines = lines.filter(([ix,k,v])=>v.every((y)=>y<-50||y>50)) 
let p2OnlyOn = p2lines.filter((x)=>x[1]==='on')

// Map all future intersections for all 'on' cubes + co-ordinates
let allOn = p2OnlyOn.map((x)=>{
    let futureOverlaps = lines.filter((y)=>y[0]>x[0])
        if (futureOverlaps.length>0){
           return [x,futureOverlaps.map(([ind,action,vals])=>[ind,action,vals,getOverlap(x[2],vals)]).filter((y)=>y[3].length>0).map(([ind,action,vals,overlaps])=>[ind,action,overlaps[3]])]
        } else {
            return [x,[]]
        }
})

// Volume of cubes with zero intersections afterwards
let alwaysOn = allOn.filter((x)=>x[1].length === 0).map((x)=>getVolume(x[0][2])).reduce((acc,curr)=>acc+curr)

// Volume of remaining cubes
let overlapsOn = allOn.filter((x)=>x[1].length>0)
let p2Total = 0

overlapsOn.forEach(([first,overlapsFirst])=>{
    let overlapsFirstRemove = overlapsFirst.filter(([ind,action,vals],ix,arr)=> arr.findIndex(([find,faction,fvals])=> (find>ind && testSuperset(vals,fvals)[1]===true && testSuperset(vals,fvals)[0]===false)|| (find<ind && testSuperset(vals,fvals)[1]===true && testSuperset(vals,fvals)[0]===false))===-1)
    let rest = overlapsFirstRemove.filter(([ind,action,vals],ix,arr)=> arr.findIndex(([find,faction,fvals])=> find>ind && testSuperset(vals,fvals)[1]===true)===-1)

    let firstVolume = getVolume(first[2])
    let firstRest = rest.map((x)=>x[2])
    let restVolume = firstRest.map((x)=>getVolume(x)).sort((a,b) => {
        if(a > b) {
          return 1;
        } else if (a < b){
          return -1;
        } else {
          return 0;
        }
      })
    
    let overlapsVolume = 0

    if(rest.length === 1){
        overlapsVolume+=getVolume(rest[0][2])
    }else {
        let fxMin = [...new Set(firstRest.map((x)=>x[0]))].sort((a,b)=>a-b)
        let fxMax = [...new Set(firstRest.map((x)=>x[1]))].sort((a,b)=>a-b)
        let fyMin = [...new Set(firstRest.map((x)=>x[2]))].sort((a,b)=>a-b)
        let fyMax = [...new Set(firstRest.map((x)=>x[3]))].sort((a,b)=>a-b)
        let fzMin = [...new Set(firstRest.map((x)=>x[4]))].sort((a,b)=>a-b)
        let fzMax = [...new Set(firstRest.map((x)=>x[5]))].sort((a,b)=>a-b)
    
        let xIntervals = intervals(fxMin,fxMax)
        let yIntervals = intervals(fyMin,fyMax)
        let zIntervals = intervals(fzMin,fzMax)
    
        const sweep = cartesian(xIntervals,yIntervals,zIntervals) // slicing all intersections

        let coOrds = sweep.next().value.flat()

        while(coOrds !== undefined){

            let overlapsTest = rest.map(([ind,action,vals])=>[ind,action,vals,getOverlap(vals,coOrds)]).filter((y)=>y[3].length>0)
            
            let overlapsRemove1 = overlapsTest.filter(([ind,action,vals,overs],ix,arr)=> arr.findIndex(([find,faction,fvals,fovers])=> (find>ind && testSuperset(overs[3],fovers[3])[1]===true &&testSuperset(overs[3],fovers[3])[0]===false) || (find<ind && testSuperset(overs[3],fovers[3])[1]===true &&testSuperset(overs[3],fovers[3])[0]===false))===-1)
            let overlaps = overlapsRemove1.filter(([ind,action,vals,overs],ix,arr)=> arr.findIndex(([find,faction,fvals,fovers])=> find>ind && testSuperset(overs[3],fovers[3])[1]===true)===-1) // filters out subsets
    
            if(overlaps.length>0){
                    overlapsVolume += overlaps[0][3][2] // Not generalised - in my input there was never more than one overlap returned
            }

            let nextCoord = sweep.next().value
            coOrds = nextCoord === undefined ? nextCoord : nextCoord.flat()
        }
    }

    p2Total+=(firstVolume-overlapsVolume)

})

console.log(p1Total+alwaysOn+p2Total)


const fs = require('fs');
const input = fs.readFileSync('../day22input.txt',{ encoding: 'utf8', flag: 'r' });

const splitregex = /(on|off|[-]{0,1}\d+)/g
const lines = input.split(/[\r\n]+/).map((x)=>x.match(splitregex).map((y,yidx)=>yidx>0?parseInt(y):y)).map((z)=>{
    return [z[0],{'x':[z[1],z[2]],'y':[z[3],z[4]],'z':[z[5],z[6]]}]
})

//console.log(lines)

function testOverlap(range1,range2){
    let [x1,x2,y1,y2,z1,z2] = Object.values(range1).flat()
    let [bx1,bx2,by1,by2,bz1,bz2] = Object.values(range2).flat()
    //console.log('range1test',[x1,x2,y1,y2,z1,z2])
    //console.log('range2test',[bx1,bx2,by1,by2,bz1,bz2])

    return [Math.max(x1,bx1) <= Math.min(x2,bx2),Math.max(y1,by1) <= Math.min(y2,by2),Math.max(z1,bz1) <= Math.min(z2,bz2)]

}

let p2lines = lines.slice().filter(([a,r])=>Object.values(r).flat().every((x)=> x<-50 || x>50)).map(([a,r])=>r).sort((a,b)=>a['z'][0]-b['z'][0])
p2lines.forEach((x)=>console.log(x))

let one = p2lines[0]
let rest = p2lines.slice(1)
rest.forEach(([a,r],idx)=>console.log('action is ',a,' idx is ',idx,' overlap ',testOverlap(one[1],r)))

function on(range1,range2){
    let overlap = testOverlap(range1,range2)
    let r1 = Object.values(range1)
    let r2 = Object.values(range2)

    let [x1,x2,y1,y2,z1,z2] = r1.flat()
    let [bx1,bx2,by1,by2,bz1,bz2] = r2.flat()
    if(overlap.every((x)=>x === false)){
        return [range1,range2]
    } else if (overlap.every((x)=> x === true)){
        return [{
            'x':[Math.min(x1,bx1),Math.max(x2,bx2)],
            'y':[Math.min(y1,by1),Math.max(y2,by2)],
            'z':[Math.min(z1,bz2),Math.max(z1,bz2)]
        }]
    } else {
        console.log('only some overlap')
        let ranges = overlap.map((x,idx)=>{            
            if(x === false){
                return[r1[idx],r2[idx]]
            } else {
                return[Math.min(r1[idx][0],r2[idx][0]),Math.max(r1[idx][1],r2[idx][1])]
            }
        })
        return ranges
    }


    // all x,y,z ranges don't overlap
        // return array with both range objects
    // all x,y,z ranges overlap
        // return array with min/max of both
    // some x,y,z overlaps, and some x,y,z doesn't
}

let t1 = { x:[-49,1],y:[-3,46],z:[-24,28]}
let t2 = { x:[2,47],y:[-22,22],z:[-23,27]}

console.log(on(t1,t2))


let first = on(lines[0][1],lines[1][1])
let second = on(first[0],lines[2][1])
let third = on(second[0],lines[3][1])
let fourth = on(third[0],lines[4][1])


let fifth = on(fourth[0],lines[5][1])
console.log(testOverlap(fourth[0],lines[5][1]))
console.log(fifth)

let area = lines.filter((x,ix,arr)=> x.slice(1).every((y)=> -50<=y && y<=50))
//console.log(area)

let parse = area.slice()

let parLen = parse.length

let offIndex = parse.findIndex((x)=>x[0]==='off')
console.log(offIndex)

let slice = parse.slice(0,offIndex)
let range = [
    Math.min(...slice.map((x)=>x[1])),
    Math.max(...slice.map((x)=>x[2])),
    Math.min(...slice.map((x)=>x[3])),
    Math.max(...slice.map((x)=>x[4])),
    Math.min(...slice.map((x)=>x[5])),
    Math.max(...slice.map((x)=>x[6]))
]

console.log(range)

console.log(parse.at(offIndex))

for(i=0;i<parLen-1;i++){
    let [a,x1,x2,y1,y2,z1,z2] = parse[i]
    let [b,bx1,bx2,by1,by2,bz1,bz2] = parse[i+1]
    console.log('**** I is ',i,' ****')
    console.log('x overlap',Math.max(x1,bx1) <= Math.min(x2,bx2))
    console.log('y overlap',Math.max(y1,by1) <= Math.min(y2,by2))
    console.log('z overlap',Math.max(z1,bz1) <= Math.min(z2,bz2))
}


let curr = parse.shift()
console.log(curr)
let queue = parse

while(queue.length>0){

}


let pos = 0
let p1pos = lines[0]
let p2pos = lines[1]
let turn = 0
let p1score = 0
let p2score = 0

while (p1score < 1000 && p2score < 1000){
    let score = [(pos%100)+1,((pos+1)%100)+1,((pos+2)%100)+1]
    let scoreIndex = score.reduce((acc,curr)=>acc+curr,0)
    if(turn%2 === 0){ // p1
        let newscore = (p1pos+scoreIndex-1)%10+1
        p1score+=newscore
        //console.log('Player 1 rolls ',score,' and moves to space ',newscore,'  for a total score of ',p1score)
        p1pos = newscore
    } else { // p2
        let newscore = (p2pos+scoreIndex-1)%10+1
        p2score+=newscore
        //console.log('Player 1 rolls ',score,' and moves to space ',newscore,'  for a total score of ',p2score)
        p2pos = newscore
    }
    pos+=3
    turn++
}

console.log(Math.min(p1score,p2score)*turn*3) // Part 1 answer

// Part 2

// Calculate frequencies for dice rolls per turn
function* permutate(items, count) {
    yield* req([])
  
    function* req(array) {
      if (array.length == count) {
        yield array.map(Number)
        return
      }
      for (const item of items) {
        yield* req(array.concat(item))
      }
    }
  }
  
let universes = [...permutate(['1', '2', '3'], 3)].map((x)=>x.reduce((acc,curr)=>acc+curr,0)).sort((a,b)=>a-b).reduce((m, k) => { m[k] = m[k] + 1 || 1; return m }, {})
let universeMap = new Map(Object.entries(universes).map(([x,y])=>[parseInt(x),y]))

function getUniverses(startArr){
    let queue  = [[startArr]]
    let result = []
    let under = []
    while (queue.length>0){
        let thisVal = queue.shift()
        let [lastScore,lastDice,lastPos] = thisVal.at(-1)
        
        for(i=3;i<=9;i++){
            let nextVal = ((lastPos+i-1)%10)+1
            if(lastScore+nextVal>=21){
                result.push(thisVal.concat([[lastScore+nextVal,i,nextVal]]))
            } else {
                queue.push(thisVal.concat([[lastScore+nextVal,i,nextVal]]))
                under.push(thisVal.concat([[lastScore+nextVal,i,nextVal]]))
            }
            
        }
    }
    return {'result':result,'under':under}
}

let p1 = getUniverses([0,0,p1pos])
let p1over = p1['result']
let p1under = p1['under']
let p1OverTurns = [...new Set(p1over.map((x)=>x.slice(1).length))]
let p1OverUniverses = p1over.map((x)=> x.map((y)=>y[1]).slice(1).map((z)=>universeMap.get(z)))
let p1UnderUniverses = p1under.map((x)=> x.map((y)=>y[1]).slice(1).map((z)=>universeMap.get(z)))

let p2 = getUniverses([0,0,p2pos])
let p2over = p2['result']
let p2under = p2['under']
let p2OverTurns = [...new Set(p2over.map((x)=>x.slice(1).length))]
let p2OverUniverses = p2over.map((x)=> x.map((y)=>y[1]).slice(1).map((z)=>universeMap.get(z)))
let p2UnderUniverses = p2under.map((x)=> x.map((y)=>y[1]).slice(1).map((z)=>universeMap.get(z)))

let p1Wins = 0
let p2Wins = 0

p1OverTurns.forEach((len)=>{
    let p1Win = p1OverUniverses.filter((x)=>x.length === len).flatMap((y)=>y.reduce((a,b)=>a*b,1))
    let p2Lose = p2UnderUniverses.filter((x)=>x.length === len-1).flatMap((y)=>y.reduce((a,b)=>a*b,1))

    p1Win.forEach((p1Total)=>{
        p2Lose.forEach((p2Total)=>{
            p1Wins+=(p1Total*p2Total)
        })
    })
})

p2OverTurns.forEach((len)=>{
    let p2Win = p2OverUniverses.filter((x)=>x.length === len).flatMap((y)=>y.reduce((a,b)=>a*b,1))
    let p1Lose = p1UnderUniverses.filter((x)=>x.length === len).flatMap((y)=>y.reduce((a,b)=>a*b,1))

    p2Win.forEach((p2Total)=>{
        p1Lose.forEach((p1Total)=>{
            p2Wins+=(p2Total*p1Total)
        })
    })
})

console.log(Math.max(p1Wins,p2Wins)) // Part 2 answer

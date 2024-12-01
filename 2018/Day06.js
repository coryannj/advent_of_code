const fs = require('fs');
const input = fs.readFileSync('../day6input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(', ').map(Number)).sort((a,b)=>a[0]-b[0])

function dist([x1,y1],[x2,y2]){
    return Math.abs(x2-x1)+Math.abs(y2-y1)
}

let minDist = 1000000
let minPoint

for(j=0;j<lines.length;j++){
    let thisPoint = lines[j]
    let totalDistance = lines.filter((x,ix)=>ix!==j).map((x)=>dist(thisPoint,x)).reduce((acc,curr)=>acc+curr,0)

    if(totalDistance<minDist){
        minDist = totalDistance
        minPoint = thisPoint
    }
}

console.log(minDist)
console.log(minPoint)
console.log(lines[26])

let queue = [minPoint.join('|')]
let p2Seen = []

while(queue.length>0){
    let thisPoint = queue.shift()
    p2Seen.push(thisPoint)

    let [x1,y1] = thisPoint.split('|').map(Number)

    let next = [[x1,y1+1],[x1,y1-1],[x1+1,y1],[x1-1,y1]].filter((x)=>!p2Seen.includes(x.join('|')) && !queue.includes(x.join('|')))

    next.forEach(([nx1,ny1])=>{
        let totalDist = lines.map(([nx2,ny2])=>dist([nx1,ny1],[nx2,ny2])).reduce((acc,curr)=>acc+curr,0)

        if(totalDist<10000){
            queue.push([nx1,ny1].join('|'))
        }
    })
}

console.log(p2Seen.length)


let allX = lines.map((x)=>x[0]).sort((a,b)=>a-b)
let allY = lines.map((x)=>x[1]).sort((a,b)=>a-b)
let [xMin,xMax,yMin,yMax] = [allX[0],allX.at(-1),allY[0],allY.at(-1)]

let newLines = lines.map((x,ix)=>[ix,x[0],x[1]].join('|')).flat()
//console.log(newLines)


console.log([xMin,xMax,yMin,yMax])

let allIndexes = lines.map((x,ix)=>ix)

let distanceMap = {}
distanceMap[0] = newLines
let pointsMap = {}
let seen = lines.map((x)=>x.join('|')).flat()
let infinteSeen = []
//console.log(seen)

function manhattan(points){
    let xy = points.map((x)=>x.split('|').map(Number))
    let result = new Set()
    let resultSeen = new Set()
    xy.forEach(([ind,x,y])=>{
        let next = [[x,y+1],[x,y-1],[x+1,y],[x-1,y]].filter(([x1,y1])=>x1>=xMin && x1<=xMax && y1>=yMin && y<=yMax)
            next.map((x)=>x.join('|')).filter((x)=>!seen.includes(x)).forEach((x)=>{
                resultSeen.add(x)
                result.add(`${ind}|${x}`)
            })
        
    })

    resultSeen.forEach((k,v,s)=>seen.push(k))
    
    return [...result].filter((x,ix,arr)=> arr.findIndex((y,yx)=>y.split('|').slice(1).join('|') === x.split('|').slice(1).join('|')) === arr.findLastIndex((z,zx)=>z.split('|').slice(1).join('|') === x.split('|').slice(1).join('|')))
}

//console.log(manhattan(newLines))
//console.log(seen)

for(i=1;i<800;i++){
    let next = manhattan(newLines)
    console.log('i is ',i,' and next length is ',next.length, 'seen length is ',seen.length,' regions left ',[...new Set(next.map((x)=>parseInt(x.split('|')[0])))].length)
    
    if(next.length>0){
        distanceMap[i] = next
        newLines = next
    } else {
        break
    }

}

let allPoints = Object.values(distanceMap).flat()
console.log(allPoints[0])

let finiteIndexes = allIndexes.filter((x)=>allPoints.findIndex((y)=>{
    let [ind,x1,y1] = y.split('|').map(Number)
    return ind === x && (x1===xMin||x1===xMax||y1===yMin||y1===yMax)
}) === -1)

console.log(finiteIndexes)

console.log(finiteIndexes.map((x)=>allPoints.filter((y)=>y.split('|').map(Number)[0]===x)).map((x)=>x.length).sort((a,b)=>a-b))

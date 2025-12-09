const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day9.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(',').map(Number))
let linesLen = lines.length

// Part 1
let p1 = Math.max(...lines.map(([x1,y1],xi,a)=>Math.max(...a.filter(([x2,y2],yi)=>yi>xi).map(([x2,y2])=>(Math.abs(x1-x2)+1)*(Math.abs(y1-y2)+1)))))

console.log('Part 1 answer is ',p1)

// Part 2

let maxX = Math.max(...lines.map((x)=>x[0]))
let maxY = Math.max(...lines.map((x)=>x[1]))

let maxXInd = lines.findIndex((x)=>x[0]===maxX)

let distObj = {
    0:[],
    1:[]
}

// let maxDist = 0
// let maxPoint

for(i=0;i<linesLen;i++){
    let [x1,y1] = lines[i]
    let [x2,y2] = lines[(i+1)%linesLen]

    let dist = Math.abs(x1-x2)+1 + Math.abs(y1-y2)+1
    if(dist>maxDist){
        maxDist=dist
        maxPoint=[[x1,y1],[x2,y2]]
    }

    distObj[i%2].push([dist,[i,i+1],[[x1,y1],[x2,y2]]])
}

distObj[0].sort((a,b)=>b[0]-a[0])
distObj[1].sort((a,b)=>b[0]-a[0])

let xLines = distObj[0][0][2].map((x)=>x[0]).every((x,i,a)=>x === a[0]) ? distObj[1] : distObj[0]
let yLines = !distObj[0][0][2].map((x)=>x[0]).every((x,i,a)=>x === a[0]) ? distObj[1] : distObj[0]

// console.log(xLines[0])
// console.log(yLines[0])

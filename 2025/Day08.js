const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day8.txt', {encoding: "utf8", flag: "r", });

const getDistance = ([x1,y1,z1],[x2,y2,z2])=> Math.pow((x1-x2),2) + Math.pow((y1-y2),2) + Math.pow((z1-z2),2)

let
    lines = input.split(/[\r\n]+/).map((x,xi)=>[xi,x.split(',').map(Number)]),
    circuits = Array(lines.length).fill('.').map((x,xi)=>new Set([xi])),
    cLen = circuits.length,
    target = 1000,
    counter = 0,
    p1,
    p2

// Pre-calculate all distances, key is dist, value is set of indices
let distances = {} 

lines.values().forEach(([xi,xv])=>{
    let rest = lines.filter((l,li)=> li > xi)

    rest.values().forEach(([ri,rv])=>{
        distances[getDistance(xv,rv)] = new Set([xi,ri])
    })
})

for(const c of Object.values(distances)){

    // Part 1 answer
    if(counter === target) p1 = circuits.map((x)=>x.size).sort((a,b)=>b-a).slice(0,3).reduce((a,c)=>a*c,1)

    counter++
    
    let cInds = [...c].map((x)=>circuits.findIndex((y)=> y.has(x)))
    
    if(cInds[0] === cInds[1]) continue;

    let cMin = cInds[0]<cInds[1] ? cInds[0] : cInds[1]
    let cMax = cMin === cInds[0] ? cInds[1] : cInds[0]

    circuits[cMin] = circuits[cMin].union(circuits[cMax])
    circuits.splice(cMax,1)
    cLen--

    // Part 2 answer
    if(cLen === 1){
        p2 = [...c].map((x)=>lines[x][1]).map((x)=> x[0]).reduce((a,c)=>a*c,1)
        break;
    }
    
}

console.log('Part 1 answer is ',p1)
console.log('Part 2 answer is ',p2)
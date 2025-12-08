const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day8.txt', {encoding: "utf8", flag: "r", });

const getDistance = ([x1,y1,z1],[x2,y2,z2])=> Math.pow((x1-x2),2) + Math.pow((y1-y2),2) + Math.pow((z1-z2),2)

let
    lines = input.split(/[\r\n]+/).map((x,xi)=>[xi,x.split(',').map(Number)]),
    circuits = Array(lines.length).fill('.').map((x,xi)=>new Set([xi])),
    target = 1000,
    counter = 0,
    p1,
    p2

// Pre-calculate all distances, then sort - key is dist, value is set of indices
let preDistances = new Map()   
lines.values().forEach(([xi,xv])=>{
    let rest = lines.filter((l,li)=>li>xi && li !== xi)

    rest.values().forEach(([ri,rv])=>{
        preDistances.set(getDistance(xv,rv),new Set([xi,ri]))
    })
})

let sortedDistances = new Map([...preDistances.entries()].sort((a,b)=>a[0]-b[0]))

for(const c of sortedDistances.values()){
    
    // Part 1 answer
    if(counter === target) p1 = circuits.filter((x)=>x !== null).map((x)=>x.size).sort((a,b)=>b-a).slice(0,3).reduce((a,c)=>a*c,1)
        
    counter++
    
    let cInds = [...c].map((x)=>circuits.findIndex((y)=> y!==null && y.has(x)))
    
    if(cInds[0] === cInds[1]) continue;

    let cMin = cInds[0]<cInds[1] ? cInds[0] : cInds[1]
    let cMax = cMin === cInds[0] ? cInds[1] : cInds[0]

    circuits[cMin] = circuits[cMin].union(circuits[cMax])
    circuits[cMax] = null

    // Part 2 answer
    if(!circuits.some((x)=>x !== null && x.size === 1)){
        p2 = [...c].map((x)=>lines[x][1]).map((x)=> x[0]).reduce((a,c)=>a*c,1)
        break;
    }
    
}

console.log('Part 1 answer is ',p1)
console.log('Part 2 answer is ',p2)
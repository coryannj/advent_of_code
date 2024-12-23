const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day23.txt', {encoding: "utf8", flag: "r", });

const cMap = input.lines().mk2d('-')

// Create adjacency list - loop
let cObj = Object.fromEntries([...new Set(cMap.flat().map((x)=>[x,new Set()]))])

cMap.forEach(([c1,c2])=>{
    cObj[c1].add(c2)
    cObj[c2].add(c1)
})

// Create adjacency list - 1-liner for fun
//let cObj = input.split(/[\r\n]+/).map((x)=>x.split('-')).reduce((a,c)=>{return a[c[0]] ? a[c[0]].add(c[1]) : a[c[0]] = new Set([c[1]]), a[c[1]] ? a[c[1]].add(c[0]) : a[c[1]] = new Set([c[0]]), a},{})

// Part 1
let t0 = performance.now()
let cSets = new Set()
let chiefs = [...Object.entries(cObj).filter(([k,v])=>k[0]==='t')]

chiefs.forEach(([k0,v0])=>{
    let connected = [...v0.values()]

    while(connected.length>0){
        let k1 = connected.shift()
        let v1 = cObj[k1]

        connected.forEach((k2)=>{
            let v2 = cObj[k2]
            if(v1.has(k2) && v2.has(k1)){
                cSets.add([k0,k1,k2].sort().join('|'))
            }
        })

    }
})

let p1 = cSets.size
let t1 = performance.now()

console.log('Part 1 answer is ',p1,t1-t0,'ms')

// Part 2
let t2 = performance.now()
let p2 = Object.entries(cObj).map(([k1,v1])=>
            Object.entries(
                [...v1].map((k2)=>
                    [...cObj[k1].intersection(cObj[k2])].concat(k1,k2).sort().join(',')).reduce((a, c) => {return a[c] ? ++a[c] : a[c] = 1, a}, {})
                ).filter(([intKey,intCount])=>
                    intKey.split(',').length === intCount+1
                ).sort((a,c)=>c[1]-a[1])[0]
         ).sort((a,c)=>c[1]-a[1])[0][0]
let t3 = performance.now()

console.log('Part 2 answer is ',p2,t3-t2,'ms')
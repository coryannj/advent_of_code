const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2017/day13.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/\n/g).map((x)=>x.split(': ').map(Number))

let max = lines.at(-1)[0]

let scanners = Object.fromEntries(lines.map(([i,l])=>{
    if(l === 2) return [i,{len:2,inds:[0,1]}]

    let iArr = Array(l).fill().map((x,xi)=>xi)
    let fullArr = iArr.concat(iArr.slice(0,-1).reverse().slice(0,-1))
    return [i,{len:fullArr.length,inds:fullArr}]

}))

// Part 1
let curr = Array(max+1).fill().map((x,i)=>scanners[i] !== undefined ? 0 : null)
let caught = []
let packet = 0

while(packet<=max){
    if(curr[packet] === 0) caught.push(packet)
    packet++
    curr = curr.map((x,i)=> x !== null ? scanners[i]['inds'][(packet)%scanners[i]['len']] : x)
}

console.log(caught.map((x)=>x*lines.find(([i,l])=>i===x)[1]).reduce((a,c)=>a+c)) // Part 1 answer

// Part 2
let p2curr = Array(max+1).fill().map((x,i)=>scanners[i] !== undefined ? 0 : null)
let p2packet = 0

while(p2curr.some((x,i)=> x !== null && scanners[i]['inds'][(p2packet+i)%scanners[i]['len']] === 0)){
    p2packet++
}

console.log('p2packet ',p2packet) // Part 2 answer
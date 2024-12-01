const fs = require('fs');
const input = fs.readFileSync('../day6input.txt',{ encoding: 'utf8', flag: 'r' });
const races = input.split(/[\r\n]+/)
const lines = input.split(/[\r\n]+/).map((x)=>x.split(/\s+/).slice(1).map(Number))

// Part 1
const time = lines[0]
const distance = lines[1]

console.log(time.map((x,ix)=>Array(x-1).fill('.').map((y,yx)=>(yx+1)*(x-(yx+1))).filter((z)=>z>distance[ix]).length).reduce((acc,curr)=>acc*curr,1))

// Part 2
const time2 = [parseInt(time.join(''))]
const distance2 = [parseInt(distance.join(''))]

console.log(time2.map((x,ix)=>Array(x-1).fill('.').map((y,yx)=>(yx+1)*(x-(yx+1))).filter((z)=>z>distance2[ix]).length).reduce((acc,curr)=>acc*curr,1))


const fs = require('fs');
const input = fs.readFileSync('../day4input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(' '))

// Part 1
console.log(lines.filter((x)=>x.every((y,yx,yarr)=> yarr.findIndex((z,zx)=>zx !== yx && z === y)=== -1)).length)

// Part 2
console.log(lines.map((x)=>x.map((y)=>y.split('').sort((a,b)=>a.localeCompare(b)).join(''))).filter((x)=>x.every((y,yx,yarr)=> yarr.findIndex((z,zx)=>zx !== yx && z === y)=== -1)).length)


const fs = require('fs');
const input = fs.readFileSync('../day2input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(/[\s\r\n]+/).map(Number).sort((a,b)=>a-b))

// Part 1
console.log(lines.map((x)=>x.at(-1)-x[0]).reduce((acc,curr)=>acc+curr))

// Part 2
console.log(lines.map((x)=>x.filter((y,yix,yarr)=>yarr.findIndex((z,zx)=>zx !== yix && (z%y===0||y%z===0)) !== -1)).map((x)=>x.at(-1)/x[0]).reduce((acc,curr)=>acc+curr))

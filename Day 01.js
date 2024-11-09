const fs = require('fs');
const input = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split('').map(Number)

// Part 1
console.log(lines.filter((x,ix,arr)=>ix<lines.length-1?x===arr[ix+1]:x===arr[0]).reduce((acc,curr)=>acc+curr))

// Part 2
let len = lines.length
let halflen = lines.length/2
console.log(lines.filter((x,ix,arr)=>x === arr[(ix+halflen)%len]).reduce((acc,curr)=>acc+curr))
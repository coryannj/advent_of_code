const fs = require('fs');
const input = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map(Number)

console.log(lines.filter((x,ix,arr)=> arr.includes(2020-x)).reduce((acc,curr)=>acc*curr,1)) // Part 1

console.log(lines.filter((x,ix,arr)=>arr.filter((z,zx,zarr)=>zx !== ix && zarr.includes(2020-x-z)).length>0).reduce((acc,curr)=>acc*curr,1)) // Part 2
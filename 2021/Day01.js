const fs = require('fs');
const input = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map(Number)
let linesLen = lines.length

console.log(lines.filter((x,ix,arr)=> ix > 0 && x>arr[ix-1]).length) // Part 1
console.log(lines.filter((x,ix,arr)=> ix>0 && (ix+2)<linesLen && (arr[ix-1]+x+arr[ix+1])<(x+arr[ix+1]+arr[ix+2])).length) // Part 2
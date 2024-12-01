const fs = require('fs');
const input = fs.readFileSync('../2024/day1.txt',{ encoding: 'utf8', flag: 'r' });
const inputExample = fs.readFileSync('../2024/day1example.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=>x.split(/[\s]+/).map(Number))

const count = (arr) => arr.reduce((acc, curr) => {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
}, {})

let col1 = lines.map((x)=>x[0]).sort((a,b)=>a-b)
let col2 = lines.map((x)=>x[1]).sort((a,b)=>a-b)
let col2Count = count(col2)

console.log(col1.map((x,ix)=>Math.abs(x-col2[ix])).reduce((acc,curr)=>acc+curr)) // Part 1 answer
console.log(col1.map((x)=>x*(col2Count[x]||0)).reduce((acc,curr)=>acc+curr)) // Part 2 answer
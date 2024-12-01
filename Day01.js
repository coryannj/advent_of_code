const fs = require('fs');
//import "../utils.js"
require('../advent_of_code_2024/utils.js');

const input = fs.readFileSync('../2024/day1.txt',{ encoding: 'utf8', flag: 'r' });
const inputE = fs.readFileSync('../2024/day1example.txt',{ encoding: 'utf8', flag: 'r' });

let arr = input.lines().mk2d('\\s+',1)
let col1 = arr.col(0).sorta()
let col2 = arr.col(1).sorta()
let col2Count = col2.counts()

console.log(col1.map((x,ix)=>Math.abs(x-col2[ix])).sum()) // Part 1 answer
console.log(col1.map((x)=>x*(col2Count[x]||0)).sum()) // Part 2 answer
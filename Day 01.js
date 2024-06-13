const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\s*\n/).map((x)=> x.split(/\n/).map(Number).reduce((acc,curr)=> acc+curr)).sort((a,b)=>b-a)

console.log(lines[0]) // Part 1 answer
console.log(lines[0]+lines[1]+lines[2]) // Part 2 answer
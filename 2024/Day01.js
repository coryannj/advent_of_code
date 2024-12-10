const fs = require('fs');
require('../utils.js');

const input = fs.readFileSync('../../day1.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1 golf version
let t=input
let [l,r]=[/^\d+/gm,/\d+$/gm].map(x=>t.match(x).sort());v=l.reduce((a,c,i)=>a+Math.abs(+c-+r[i]),0)
console.log(v)

// Non golf version
let arr = input.lines().mk2d('\\s+',1)
let col1 = arr.col(0).sorta()
let col2 = arr.col(1).sorta()
let col2Count = col2.counts()

console.log(col1.map((x,ix)=>Math.abs(x-col2[ix])).sum()) // Part 1 answer
console.log(col1.map((x)=>x*(col2Count[x]||0)).sum()) // Part 2 answer
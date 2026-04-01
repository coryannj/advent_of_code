const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2015/day01.txt', {encoding: "utf8", flag: "r", });

console.log(eval(0+input.replace(/\(|\)/g,m=> m === '(' ? '+1' : '+ -1'))) // Part 1

console.log(input.split('').map((x)=> x ==='(' ? 1 : -1).cumSum().findIndex((x)=>x === -1)+1) // Part 2
const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2015/day05.txt', {encoding: "utf8", flag: "r", });

const vowels = /([aeiou])/g
const repeat = /(.)\1/
const banned = /ab|cd|pq|xy/

const p2pair = /(.{2}).*(?=\1)/
const p2repeat = /(.).\1/

let lines = input.split(/\n/g)

console.log(lines.filter((x)=>!banned.test(x) && repeat.test(x) && vowels.test(x) && x.match(vowels).length >= 3).length) // Part 1
console.log(lines.filter((x)=>p2pair.test(x) && p2repeat.test(x)).length) //Part 2


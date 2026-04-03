const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day14.txt', {encoding: "utf8", flag: "r", });

let reindeer = input.split(/\n/g).map((x)=>x.match(/\d+/g).map(Number))
let time = 2503

const getDist = (t,[s,m,r]) => (Math.floor(t/(m+r))*s*m) + (s*Math.min(t%(m+r),m))

console.log(Math.max(...reindeer.map((x)=>getDist(time,x)))) // Part 1

let p2 = Array(time).fill().map((x,i)=>reindeer.map((y)=>getDist(i+1,y))).reduce((a,c)=> {return max = Math.max(...c),a.map((v,vi)=>c[vi] === max ? v+1 : v)},Array(reindeer.length).fill(0))

console.log(Math.max(...p2)) // Part 2

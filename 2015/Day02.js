const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2015/day02.txt', {encoding: "utf8", flag: "r", });

const wrapping = ([l,w,h]) => (2*l*w) + (2*w*h) + (2*h*l)

let lines = input.split(/\n/g).map((x) => x.split('x').map(Number))
//console.log(lines)
console.log(lines.map((x)=>wrapping(x)+x.toSorted((a,b)=>a-b).slice(0,2).reduce((a,c)=>a*c,1)).reduce((a,c)=>a+c))

console.log(lines.map((x)=>{
    let s = x.toSorted((a,b)=>a-b)
    return s.slice(0,-1).reduce((a,c)=>a+(2*c),0) + s.reduce((a,c)=>a*c,1)
}).reduce((a,c)=>a+c))
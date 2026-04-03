const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day08.txt', {encoding: "utf8", flag: "r", });

let lines = input.split('\n')

console.log(lines.reduce((a,c)=>a+(c.length-c.slice(1,-1).replace(/[\\]{2}/g,'_').replace(/([\\]x[0-9A-Fa-f][0-9A-Fa-f])|[\\]["]/g,'a').length),0)) // Part 1

console.log(lines.reduce((a,c)=>a+Math.abs(c.length-(c.replace(/[\\]/g,"\\\\").replace(/["]/g,'\\"').length+2)),0)) // Part 2
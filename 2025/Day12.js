const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day12.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/\n\n/).map((x)=>x.split(/[\r\n]+/))

let regions = lines.at(-1).map((x)=>x.match(/\d+/g).map(Number)).map((x)=>[[x[0],x[1]],x.slice(2)])

let shapes = lines.slice(0,-1).map((x)=>[parseInt(x[0].slice(0,-1)),x.slice(1).join('').replaceAll('.','').length,x.slice(1)])

let p1 = 0

regions.forEach(([grid,counts])=>{
    let gridLen = grid.reduce((a,c)=>a*c,1)
    let minSquares = counts.map((x,xi)=>x*shapes[xi][1]).reduce((a,c)=>a+c,0)

    if (gridLen >= minSquares) p1++
})

console.log(p1)
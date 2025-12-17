const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day12.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/\n\n/).map((x)=>x.split(/[\r\n]+/))

// 1-liner
console.log(input.split(/\n\n(?=\d+x)/).map((x,xi) => xi===0 ? x.split(/\n\n/).map((y) => y.match(/[#]/g).length) : x.split(/\n/).map((y) => y.split(':').map((z,zi) => zi===0 ? eval(z.replace('x','*')) : z.match(/\d+/g).map(Number)))).map((x,xi,arr) => xi === 0 ? x : x.filter(([g,r])=> g >= r.reduce((a,c,ci)=> a+=(c*arr[0][ci]),0)).length)[1])

// More than 1 liner
let regions = lines.at(-1).map((x)=>x.match(/\d+/g).map(Number)).map((x)=>[[x[0],x[1]],x.slice(2)])

let shapes = lines.slice(0,-1).map((x)=>[parseInt(x[0].slice(0,-1)),x.slice(1).join('').replaceAll('.','').length,x.slice(1)])

let p1 = 0

regions.forEach(([grid,counts])=>{
    let gridLen = grid.reduce((a,c)=>a*c,1)
    let minSquares = counts.map((x,xi)=>x*shapes[xi][1]).reduce((a,c)=>a+c,0)

    if (gridLen >= minSquares) p1++
})

console.log(p1)
const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2019/day24.txt', {encoding: "utf8", flag: "r", });

let grid = input.split(/\n/g).map((x)=>x.split(''))

const change = (r,c,val) => {
    let neighbours = [[r+1,c],[r-1,c],[r,c-1],[r,c+1]].map(([nr,nc])=>grid?.[nr]?.[nc]||'_').reduce((a,c)=>{return a[c]++,a},{'.':0,'#':0,'_':0})

    if(val === '#' && neighbours['#'] !== 1) return '.'
    if(val === '.' && [1,2].includes(neighbours['#'])) return '#'
    return val
}

let seen = new Set()

do{
    seen.add(grid.map((x)=>x.join('')).join(''))
    grid = grid.map((x,xi)=>x.map((y,yi)=>change(xi,yi,y)))

    //grid.forEach((x)=>console.log(x.join('')))
    //console.log('.           ')
} while(!seen.has(grid.map((x)=>x.join('')).join('')))

console.log(grid.flat().map((x,i)=>x==='#' ? Math.pow(2,i) : 0).reduce((a,c)=>a+c))

//console.log(seen)
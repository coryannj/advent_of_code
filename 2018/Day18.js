const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2018/day18.txt', {encoding: "utf8", flag: "r", });

let grid = input.split(/\n/g).map((x)=>x.split(''))

const change = (r,c,val) => {
    let neighbours = [[r+1,c-1],[r+1,c],[r+1,c+1],[r,c+1],[r-1,c+1],[r-1,c],[r-1,c-1],[r,c-1]].map(([nr,nc])=>grid?.[nr]?.[nc]||'_').reduce((a,c)=>{return a[c]++,a},{ '#': 0, '|': 0, '.': 0, _: 0 })

    if(val ==='.' && neighbours['|']>=3) return '|'
    if(val === '|' && neighbours['#']>=3) return '#'
    if(val ==='#' && (neighbours['#']<1 || neighbours['|']<1)) return '.'
    return val
}

let
    seen = [grid.map((x)=>x.join('')).join('')],    
    loops = 2,
    rounds = 1,
    fast = -1,
    slow 

for(i=0;i<loops;i++){
    slow = -1

    do {
        grid = grid.map((x,xi)=>x.map((y,yi)=>change(xi,yi,y)))

        seen.push(grid.map((x)=>x.join('')).join(''))
        
        if(rounds%2 === 1){
            slow++
            fast+=(i === 0 ? 2 : 1)            
        }
        
        rounds++

    } while(seen[slow] !== seen[fast])
}

let p1Counts = seen[10].split('').counts()
console.log(p1Counts['|']*p1Counts['#']) // Part 1 answer

let offset = slow-1
let cycleLen = fast-slow
let remainder = (1000000000-offset)%cycleLen
let p2Counts = seen[offset+remainder].split('').counts()
console.log(p2Counts['|']*p2Counts['#']) // Part 2 answer
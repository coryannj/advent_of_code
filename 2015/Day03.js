const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2015/day03.txt', {encoding: "utf8", flag: "r", });

let lines = input.split('')

const solve = (partNo) =>{
    let start = [0,0]
    let seen = new Set([start.join('_')])

    const move = ([r,c],d) => {
        let next = {
            '^':[r-1,c],
            'v':[r+1,c],
            '>':[r,c+1],
            '<':[r,c-1]
        }
        return next[d]
    }

    partNo === 1 
        ? lines.reduce((pos,c)=> {nPos = move(pos,c);seen.add(nPos.join('_')); return nPos},start) 
        : lines.reduce((pos,c,i)=> {nPos = move(pos[i%2],c);seen.add(nPos.join('_')); return pos.map((p,pi)=>pi === i%2 ? nPos:p)},[start,start])

    return seen.size
}

console.log(solve(1))
console.log(solve(2))
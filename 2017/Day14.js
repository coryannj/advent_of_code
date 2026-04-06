const fs = require('fs');
const { solve } = require('./Day10.js');
require('../inputs/utils.js');
// const input = fs.readFileSync('../inputs/2017/day10.txt', {encoding: "utf8", flag: "r", });

const hex2bin = (data) => data.split('').map(x => 
parseInt(x, 16).toString(2).padStart(4, '0')).join('');

const input = 'xlqgujun'
const len = 128

let grid = Array(len).fill().map((x,i)=>hex2bin(solve(input+'-'+i,2)).replaceAll('1','#').replaceAll('0','.'))

console.log('Part 1 ' ,grid.join('').replaceAll('.','').length) // Part 1

// Part 2
let queue = grid.flatMap((x,xi)=>x.split('').flatMap((y,yi)=> y === '#' ? [[xi,yi]]: []))

let allRegions = []

let seen = new Set()

const nextArr = ([r,c]) => [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=>grid?.[nr]?.[nc] === '#' && !seen.has(`${nr}_${nc}`))

while(queue.length){
    let next = queue.shift()
    if(seen.has(next.join('_'))) continue;
    seen.add(next.join('_'))
    let thisRegion = [next]
    let len

    do{
        let queue = thisRegion.slice(len||0)

        len = thisRegion.length
        queue.forEach(([tr,tc])=>{
            nextArr([tr,tc]).forEach(([nr,nc])=>{
                thisRegion.push([nr,nc])
                seen.add(`${nr}_${nc}`)
            })
        })
    } while(thisRegion.length !== len)
    allRegions.push(thisRegion)
}

console.log('Part 2 ',allRegions.length)
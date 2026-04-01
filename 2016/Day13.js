const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day13.txt', {encoding: "utf8", flag: "r", });

const fav = +input
let start = [1,1]
let endKey = [31,39].join('_')
let seen = new Set([start.join('_')])

const check = (x,y) => ((x*x)+(3*x)+(2*x*y)+y+(y*y)+fav).toString(2).replaceAll('0','').length%2 === 0

const next = ([x,y]) => [[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([nx,ny])=>nx>=0 && ny>=0 && check(nx,ny) && !seen.has(`${nx}_${ny}`))

let queue = [start]
let steps = 0
let p2

while(!seen.has(endKey)){
    steps++
    let nextQueue = []
    queue.forEach((v)=>{
        next(v).forEach((nv)=>{
            seen.add(nv.join('_'))
            nextQueue.push(nv)
        })
    })
    queue = nextQueue
    if(steps === 50) p2 = seen.size
}
console.log(steps) //Part 1
console.log(p2) // Part 2
const fs = require("fs");
require("../utils.js");
const { nextArr } = require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day10.txt', {encoding: "utf8", flag: "r", });
const grid = input.lines().mk2d('',1).map((x,ix)=>x.map((y,yx)=>[ix,yx,y]))
let queue = grid.flat().filter((x)=>x[2]===0).map((x)=>[x])

let p1 = Object.fromEntries(queue.map((x)=>[x.flat().join('|'),new Set()]))
let p2 = new Set()

let t0 = performance.now()

while(queue.length>0){
    let next = queue.shift();
    let [r,c,val] = next.at(-1);
    const nextTest = (([nr,nc]) => grid[nr]?.[nc]?.[2]===val+1);  

    if(val === 9){
       p1[next[0].join('|')].add([r,c,val].join('|'));
       p2.add(next.join('|'));
    } else {
        nextArr([r,c],0,grid,nextTest).forEach(([nr,nc])=>{
            queue.push(next.concat([grid[nr][nc]]));
        })
    }    
}

let p1ans = Object.values(p1).map((x)=>x.size).sum()
let p2ans = p2.size
let t1 = performance.now()

console.log('Part 1 answer is ',p1ans) // P1 answer
console.log('Part 2 answer is ',p2ans) // P2 answer
console.log(t1-t0,' milliseconds') // runtime

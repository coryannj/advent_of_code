const fs = require("fs");
require("../utils.js");
const { nextArr } = require("../utils.js");
const input = fs.readFileSync('./inputs/2024/day10.txt', {encoding: "utf8", flag: "r", });
const grid = input.lines().mk2d('',1).map((x,ix)=>x.map((y,yx)=>[ix,yx,y]))
let queue = grid.flat().filter((x)=>x[2]===0).map((x)=>[x])

let p1 = Object.fromEntries(queue.map((x)=>[x.flat().join('|'),new Set()]))
let p2 = new Set()

let [r,c,val] = queue[0][0]
console.log(r,c,val)
const nextTest = (([nr,nc]) => grid[nr]?.[nc]?.[2]===val+1)  

//const cumulativeSum = (sum => value => sum += value)(0);

console.log(nextArr([r,c],grid,nextTest))

while(queue.length>0){
    let next = queue.shift()
    let [r,c,val] = next.at(-1)

    if(val === 9){
       p1[next[0].join('|')].add([r,c,val].join('|'))
       p2.add(next.join('|'))
    } else {
        [[r,c+1],[r,c-1],[r+1,c],[r-1,c]].filter(([nr,nc])=> grid[nr]?.[nc]?.[2]===val+1).forEach(([nr,nc])=>{
            queue.push(next.concat([grid[nr][nc]]))
        })
    }    
}

console.log(Object.values(p1).map((x)=>x.size).sum())
console.log(p2.size)
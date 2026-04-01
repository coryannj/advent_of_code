const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day22.txt', {encoding: "utf8", flag: "r", });

const dRegex = /(\d+)/g

let lines = input.split(/\n/).slice(2).map((x)=>x.match(dRegex).map(Number))

let p1 = lines.slice(0,-1)
            .map(([x1,y1,size1,used1,avail1,p1],i)=>lines.slice(i+1).filter(([x2,y2,size2,used2,avail2,p2])=>(used1 !== 0 && used1<=avail2) || (used2 !== 0 && used2<= avail1)).length)
            .reduce((a,c)=>a+c,0)

console.log(p1) // Part 1

let xx = Math.max(...lines.map((x)=>x[0]))
let yy = Math.max(...lines.map((x)=>x[1]))
let empty
let wall = [] 

let grid = Array(yy+1).fill().map((y,yi)=>Array(xx+1).fill().map((x,xi)=>{
    let node = lines.find(([x1,y1,size1,used1,avail1,p1])=>x1 === xi && y1 === yi)
    if(node[3] === 0){
       empty = node
        return '_'
    } 
    if(node[3]>89){
        wall.push(node)
        return '#'
    } 
        
    return '.'
}))

let minWallX = Math.min(...wall.map((x)=>x[0]))
let emptyS = [empty[1],empty[0]]
let top = [0,minWallX-1]
let nextToGoal = [0,xx-1]
let p2steps = 0

p2steps+=(Math.abs(emptyS[0]-top[0])+Math.abs(emptyS[1]-top[1])+Math.abs(nextToGoal[1]-top[1]))
p2steps+=(5*(xx-1))
p2steps++

console.log(p2steps) // Part 2

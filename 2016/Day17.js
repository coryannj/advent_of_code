const fs = require('fs');
const { md5 } = require('../utils.js');

const nextArr = (r,c) => [[r+1,c,'D'],[r-1,c,'U'],[r,c+1,'R'],[r,c-1,'L']].filter(([nr,nc])=>0<=nr && nr<4 && 0<=nc && nc<4)

const grid = Object.fromEntries(Array(4).fill().map((x,xi)=>Array(4).fill().map((y,yi)=>[[xi,yi].join('_'),nextArr(xi,yi).map((x)=>[`${x[0]}_${x[1]}`,x[2]])])).flat())

const hashDir = 'UDLR'
const open = 'bcdef'
const endKey = '3_3'
let start = '0_0'
let passCode = 'edjrjqaa'
let queue = [['',start]]
let minPath
let min = Infinity
let max = 0

while(queue.length>0){
    let [path,curr] = queue.shift()
    let findHash = md5(passCode+path).slice(0,4)
    let next = grid[curr].filter(([k,dir])=> open.includes(findHash[hashDir.indexOf(dir)]))

    next.forEach(([k,d]) =>{
        if(k === endKey){
            let fullPath = path+d
            if(fullPath.length>max) max = fullPath.length
            if(fullPath.length<min){
                min = fullPath.length
                minPath = fullPath
            }
        } else {
            queue.push([path+d,k])
        }
    })
}
console.log(minPath) // Part 1
console.log(max) // Part 2
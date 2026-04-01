const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day15.txt', {encoding: "utf8", flag: "r", });

const numRegex = /(?<=has\s|position\s)(\d+)/g
let lines = input.split(/\n/g).map((x)=>x.match(numRegex).map(Number))

const solve = (partNo) => {
    if(partNo === 2) lines.push([11,0])
    
    let t = 0

    while(lines.some(([m,r],i)=>(r+i+1+t)%m !== 0)){
        t++
    }
    
    return t
}

console.log(solve(1)) //Part 1
console.log(solve(2)) //Part 2
const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day1.txt', {encoding: "utf8", flag: "r", });

let
    instructions = input.split(/[\r\n]+/).map((x)=>parseInt(`${x[0] === 'L' ? '-' : '+'}${x.slice(1)}`)),
    len = 100;

// Part 1
console.log('Part 1 answer is ',instructions.values().reduce(([currVal,currZeros],c)=>{
    let newInd = (currVal+c)%len;
    if(newInd<0) newInd+=len;
    if(newInd>len) newInd-=len;

    return newInd === 0 ? [newInd,++currZeros] : [newInd,currZeros]
},[50,0])[1])

// Part 2
console.log('Part 2 answer is ',instructions.values().reduce(([currVal,currZeros],c)=>{
    let newInd = currVal+(c%len);
    currZeros+=Math.floor(Math.abs(c/len));
    if((currVal !== 0 && newInd<=0) || newInd>=len) currZeros++;
    if(newInd<0) newInd+=len;
    if(newInd>=len) newInd-=len;

    return [newInd,currZeros];
},[50,0])[1])
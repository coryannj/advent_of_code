const fs = require('fs');
const input = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/[\r\n]+/)

//Part 1
console.log(lines.map((x)=>{
    let match = x.match(/[\d]/g);

    return match.length === 1 ? parseInt(`${match[0]}${match[0]}`):parseInt(`${match[0]}${match.at(-1)}`)
}).reduce((acc,curr)=>acc+curr))

//Part 2

const lookup =  ['_','on','w','hre','four','fiv','six','seve','igh','ine']
const matchRegex = /(on)(?=e)|(?<=t)(w)(?=o)|(?<=t)(hre)(?=e)|(four)|(fiv)(?=e)|(six)|(seve)(?=n)|(?<=e)(igh)(?=t)|(?<=n)(ine)|\d/gm

console.log(lines.map((x)=>{
    let match = x.match(matchRegex).map((y)=> lookup.includes(y) ? lookup.indexOf(y) : y);
    
    return match.length === 1 ? parseInt(`${match[0]}${match[0]}`):parseInt(`${match[0]}${match.at(-1)}`)
}).reduce((acc,curr)=>acc+curr))
const fs = require('fs');
const input = fs.readFileSync('../day6input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\n/).map((x)=>x.split(/[\r\n]+/)).map((x)=> x.map((y)=> y.split('').sort((a,b)=>a.localeCompare(b)).join('')))

console.log(lines.map((x)=> [...new Set(x.map((y)=>y.split('')).flat())].length).reduce((acc,curr)=>acc+curr,0)) // Part 1

console.log(lines.flatMap((x,ix,arr)=>{
    if(x.length === 1){
        return [x]
    } else {
        let split = x.map((y)=>y.split('')).map((y,yx,yarr)=>y.filter((z)=>yarr.every((yr)=>yr.includes(z))))

        if(split.every((x)=>x.length>0)){
            return [split.map((x)=>x.join(''))]
        } else {
            return []
        }
    }
}).map((x)=> [...new Set(x.map((y)=>y.split('')).flat())].length).reduce((acc,curr)=>acc+curr,0)) // Part 2
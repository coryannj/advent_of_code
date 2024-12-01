const fs = require('fs');
const input = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map(Number)

console.log(lines.map((x)=>Math.floor(x/3)-2).reduce((acc,curr)=>acc+curr,0)) // Part 1 answer

let fuel = 0

lines.forEach((x)=>{
    let thisFuel = Math.floor(x/3)-2

    while(thisFuel>0){
        fuel += thisFuel

        thisFuel = Math.floor(thisFuel/3)-2
    }
})

console.log(fuel) // Part 2 answer
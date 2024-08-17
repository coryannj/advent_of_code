const fs = require('fs');
const input = fs.readFileSync('../day2input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=> x.match(/(\w+)/g)).map((x)=> x.map((y,ix)=>ix<2? parseInt(y):y))

// Part 1
console.log(lines.filter(([min,max,letter,password])=>{
    let valid = password.split('').filter((x)=> x === letter).length;

    return min<= valid && valid <= max
}).length)

// Part 2
console.log(lines.filter(([min,max,letter,password])=>{
    let split = password.split('');
    
    return ((split[min-1] === letter && split[max-1] !== letter) || (split[max-1] === letter && split[min-1] !== letter))
}).length)

const fs = require('fs');
const input = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map(Number)
console.log(lines.reduce((a,b)=>a+b,0)) // Part 1 answer

//Part 2
let len = lines.length
let repeatFreq
let seen = []
let frequency = 0
let index = 0

while(!repeatFreq){
    frequency += lines[index%len]

    if(seen.includes(frequency)){
        repeatFreq = frequency
        break;
    }
    seen.push(frequency)
    index++
}
console.log(repeatFreq) // Part 2 answer


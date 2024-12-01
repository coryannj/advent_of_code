const fs = require('fs');
const input = fs.readFileSync('../day5input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map(Number)

let len = lines.length

// Part 1
let p1lines = lines.slice()
let p1currIndex = 0
let p1counter = 0

while(p1currIndex>=0 && p1currIndex < len){
    let nextIndex = p1currIndex + p1lines[p1currIndex]
    p1lines[p1currIndex]++
    p1currIndex = nextIndex
    p1counter++
}

console.log(p1counter)

// Part 2
let p2lines = lines.slice()
let p2currIndex = 0
let p2counter = 0

while(p2currIndex>=0 && p2currIndex < len){
    let nextIndex = p2currIndex + p2lines[p2currIndex]
    //p1lines[p1currIndex]++

    if(p2lines[p2currIndex]>=3){
        p2lines[p2currIndex]--
    } else {
        p2lines[p2currIndex]++
    }

    p2currIndex = nextIndex
    p2counter++
}

console.log(p2counter)
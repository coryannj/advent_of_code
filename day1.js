const fs = require('fs');
const inputload = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });
const input = inputload.split(/[\r\n]+/)

//Part 1

//Regex to get first and last digits
let part1regex = /(?<=^\D*)(\d)|(\d)(?=\D*$)/gm

//Map runs above regex on each line and checks for string length. If 1 then concat to itself, then convert to number and sum the array
let calibrationsum1 = input
.map((x) => {
    let match = x.match(part1regex).join('')
    return match.length>1 ? parseInt(match) : parseInt(match+match)
})
.reduce((acc,curr) => acc + curr,0)
console.log(calibrationsum1) // Part 1 answer

//Part 2

//Regex to get overlapping matches using positive lookahead
let part2regex = /(?=(one|two|three|four|five|six|seven|eight|nine|\d))/gm

let replacelookup = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5', 
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine':'9'
}

//Map runs regex and replaces words by lookup, then sum array with reduce
let calibrationsum2 = input
.map((x) => {
    let match = [...x.matchAll(part2regex)]
    .filter((y,idx,arr)=> idx === 0 || idx === arr.length-1)
    .map((z)=> replacelookup[z[1]] === undefined ? z[1] : replacelookup[z[1]])
    .join('')
    return match.length>1 ? parseInt(match) : parseInt(match+match)
})
.reduce((acc,curr) => acc + curr,0)
console.log(calibrationsum2) // Day 2 answer
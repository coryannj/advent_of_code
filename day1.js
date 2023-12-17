const fs = require('fs');
const inputload = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });
const input = inputload.split(/[\r\n]+/)

//Part 1

//Regex to get first and last digits
let firstlastregex = /(?<=^\D*)(\d)|(\d)(?=\D*$)/gm

//Map runs above regex on each line and checks for string length. If 1 then concat to itself, then convert to number and sum the array
let calibrationsum1 = input
.map((x) => {
    let match = x.match(firstlastregex).join('')
    return match.length>1 ? parseInt(match):parseInt(match.concat(match))
})
.reduce((acc,curr) => acc + curr,0)
console.log(calibrationsum1) // Part 1 answer

//Part 2

//Regex - seperate for first and last bc of overlapping letters ugh
let firstregex = /(one|two|three|four|five|six|seven|eight|nine|\d).*/
let lastregex = /.*(one|two|three|four|five|six|seven|eight|nine|\d)/

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

function replacewords(str) {
    return str.length === 1 ? str : replacelookup[str]
}

//Map runs regex and replaces words by lookup, then sum array with reduce
let calibrationsum2 = input
.map((x) => {
    let first = replacewords(x.match(firstregex)[1])
    let last = replacewords(x.match(lastregex)[1])
    return last.length>0 ? parseInt(first.concat(last)):parseInt(first.concat(first))
})
.reduce((acc,curr) => acc + curr,0)
console.log(calibrationsum2) // Day 2 answer
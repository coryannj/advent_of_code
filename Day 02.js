const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day2input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.replace(' ',''))

let p1result = {
    AX: 3+1,
    BX: 0+1,
    CX: 6+1,
    AY: 6+2,
    BY: 3+2,
    CY: 0+2,
    AZ: 0+3,
    BZ: 6+3,
    CZ: 3+3
}

let p1score = lines.map((x)=>p1result[x]).reduce((acc,curr)=>acc+curr)
console.log(p1score) // Part 1 answer

// Part 2
let p2result = {
    AX: 0+3,
    BX: 0+1,
    CX: 0+2,
    AY: 3+1,
    BY: 3+2,
    CY: 3+3,
    AZ: 6+2,
    BZ: 6+3,
    CZ: 6+1
}

let p2score = lines.map((x)=>p2result[x]).reduce((acc,curr)=>acc+curr)
console.log(p2score) // Part 2 answer

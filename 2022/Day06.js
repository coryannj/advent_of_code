const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day6input.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1
const p1len = 4
let p1start = input.substring(0,p1len).split('')
let p1rest = input.substring(p1len).split('')

let p1counter = p1len

while (p1start.some((x,ix,arr)=>arr.indexOf(x) !== arr.lastIndexOf(x))){
    p1counter++
    p1start.shift()
    p1start.push(p1rest.shift())
}
console.log(p1counter) // Part 1 answer

// Part 2
const p2len = 14
let p2start = input.substring(0,p2len).split('')
let p2rest = input.substring(p2len).split('')

let p2counter = p2len

while (p2start.some((x,ix,arr)=>arr.indexOf(x) !== arr.lastIndexOf(x))){
    p2counter++
    p2start.shift()
    p2start.push(p2rest.shift())
}
console.log(p2counter) // Part 2 answer
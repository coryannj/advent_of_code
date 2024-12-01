const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day3input.txt',{ encoding: 'utf8', flag: 'r' });


let priority='_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Part 1
let p1lines = input.split(/[\r\n]+/).map((x)=>[x.substring(0,x.length/2).split(''),x.substring(x.length/2).split('')])

let p1 = p1lines.map(([x1,x2])=> {
    let unique = x1.find((y)=> x1.indexOf(y)!== -1 && x2.indexOf(y) !== -1)
    return priority.indexOf(unique)
}).reduce((acc,curr)=>acc+curr)

console.log(p1) // Part 1 answer

// Part 2
let p2lines = input.split(/[\r\n]+/)
let p2 = 0

for(i=0;i<p2lines.length;i+=3){
    let group = p2lines.slice(i,i+3).map((x)=>x.split(''));
    let item = group[0].find((x)=> group[1].indexOf(x) !== -1 && group[2].indexOf(x) !== -1);
    let itemPriority = priority.indexOf(item);
    p2 += itemPriority;
}

console.log(p2) // Part 2 answer


const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day4input.txt',{ encoding: 'utf8', flag: 'r' });

const numRegex = /(\d+)/g
const lines = input.split(/[\r\n]+/).map((x)=> x.match(numRegex).map(Number))

let p1overlapping = 0
let p2overlapping = 0
lines.forEach(([x1,x2,y1,y2])=>{
    if(x1<=y1 && x2>=y2 || y1<=x1 && y2>=x2){
        p1overlapping++
    }

    if(Math.max(x1,y1)<=Math.min(x2,y2)||Math.max(x2,y2)<=Math.min(x1,y1)){
        p2overlapping++
    }

})

console.log(p1overlapping) // Part 1 answer
console.log(p2overlapping) // Part 1 answer





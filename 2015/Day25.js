const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day25.txt', {encoding: "utf8", flag: "r", });

let [endR,endC] = input.match(/\d+/g).map(Number)

let dr = endR+(endC-1)

let dIndex = dr*(dr-1)/2 + endC

let num = 20151125

while(--dIndex){
    num = (num*252533)%33554393
}

console.log(num) // Part 1
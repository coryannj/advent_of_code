const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day10.txt', {encoding: "utf8", flag: "r", });

const solve = (str,rounds) => {
    while(rounds--){
        str = str.replace(/(.)\1*/g,m=>`${m.length}${m[0]}`)
    }

    return str.length
}

console.log(solve(input,40))
console.log(solve(input,50))
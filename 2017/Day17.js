const fs = require('fs');
require('../inputs/utils.js');
// const input = fs.readFileSync('../inputs/2017/day22.txt', {encoding: "utf8", flag: "r", });

const solve = (partNo) => {
    const input = 371

    let
        rounds = partNo === 1 ? 2017 : 50000000,
        spinlock = {0:0},
        currPos = 0
    
    for(i=1;i<=rounds;i++){
        for(j=0;j<input;j++){
            currPos = spinlock[currPos]
        }

        spinlock[i] = spinlock[currPos]
        spinlock[currPos] = i
        currPos = i
    }

    return spinlock[partNo === 1 ? 2017 : 0]
}

console.log(solve(1))
console.log(solve(2))
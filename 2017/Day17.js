const fs = require('fs');
require('../inputs/utils.js');
// const input = fs.readFileSync('../inputs/2017/day22.txt', {encoding: "utf8", flag: "r", });

const solve = (partNo) => {
    const input = 371
    
    let
        rounds = partNo === 1 ? 2017 : 50000000,
        spinlock = {0:0},
        currVal = 1,
        currPos = 0
    
    do {
        for(i=0;i<input;i++){
            currPos = spinlock[currPos]
        }

        spinlock[currVal] = spinlock[currPos]
        spinlock[currPos] = currVal
        
        currPos = currVal
        currVal++
    } while(currVal<=rounds)

    return spinlock[partNo === 1 ? 2017 : 0]
}

console.log(solve(1))
console.log(solve(2))
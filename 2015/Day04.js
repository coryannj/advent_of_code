const fs = require('fs');
const { md5 } = require('../utils.js');
require('../utils.js');

const solve = (partNo) => {
    const input = 'iwrupvqb'
    let hash
    let counter = 0
    let target = partNo === 1 ? '00000' : '000000'
    let targetLen = target.length

    do{
        hash = md5(input+counter++)
    } while(hash.slice(0,targetLen) !== target)

    return counter-1
}

console.log(solve(1))
console.log(solve(2))
const fs = require('fs');
const { highestFactor } = require('../utils.js');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day19.txt', {encoding: "utf8", flag: "r", });

let noElves = +input

console.log((noElves-Math.pow(2,Math.floor(Math.log2(noElves))))*2+1) // Part 1 - shout out to Numberphile: https://www.youtube.com/watch?v=uCsD3ZGzMgE

const solvep2 = (n) => {
    let highestFactor = Math.pow(3,Math.floor(Math.log(n)/Math.log(3)))
    let remainder = n-highestFactor
    let mod = remainder%highestFactor

    if(n%highestFactor === 0) return highestFactor
    return remainder<highestFactor ? mod : remainder+mod
}

console.log(solvep2(noElves)) // Part 2
const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2017/day23.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/\n/g).map((x)=>x.split(' ').map((y)=>isNaN(y) ? y : parseInt(y)))

const solve = (partNo) => {
    let currIndex = 0
    let len =  partNo === 1 ? lines.length : 8

    let register = Object.fromEntries(['a','b','c','d','e','f','g','h'].map((x)=>[x,0]))
    
    if(partNo === 2) register['a'] = 1

    const ops = {
        set:(x,y) => register[x] = (isNaN(y) ? register[y] : y),
        sub:(x,y) => register[x]-=(isNaN(y) ? register[y] : y),
        mul:(x,y) => register[x]*=(isNaN(y) ? register[y] : y),
        jnz:(x,y) => currIndex+=((isNaN(x) ? register[x] : x) !== 0 ? (isNaN(y) ? register[y] : y) : 1)
    }

    let mCount = 0

    while(currIndex<len){
        let [op,...args] = lines[currIndex]
        ops[op](...args)
        if(op[0] !== 'j') currIndex++
        if(op === 'mul') mCount++
    }

    return partNo === 1 ? mCount : register
}

console.log(solve(1)) // Part 1

// Part 2
let p2register = solve(2)
let start = p2register['b']
let end = p2register['c']
let step = -lines.at(-2).at(-1)

const isPrime = (n) => {
    for(i=2;i<Math.ceil(Math.sqrt(n));i++){
        if(n%i===0) return false
    }
    return true
}

let range = Array((end-start)/step+1).fill(start).map((x,i)=>x+(i*step)).filter((x)=> !isPrime(x))

console.log(range.length) // Part 2
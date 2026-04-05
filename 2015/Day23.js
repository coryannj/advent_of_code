const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day23.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/\n/g).map((x)=>x.match(/([\w-+]+)/g).map((y)=>isNaN(y) ? y : parseInt(y)))

const solve = (partNo) => {
    let
        register = {a:0,b:0},
        currInd = 0,
        len = lines.length

    if(partNo === 2) register['a'] = 1

    const ops = {
        hlf:(r)=> register[r] = Math.floor(register[r])/2,
        tpl:(r) => register[r]*=3,
        inc:(r) => register[r]++,
        jmp:(offset) => currInd+=offset,
        jie:(r,offset) => register[r]%2 === 0 ? currInd+=offset : currInd++,
        jio:(r,offset) => register[r] === 1 ? currInd+=offset : currInd++
    }

    while(currInd<len){
        let [ins,...args] = lines[currInd]
        ops[ins](...args)
        if(ins[0] !== 'j')currInd++
    }

    return register['b']
}

console.log(solve(1))
console.log(solve(2))
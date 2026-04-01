const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day12.txt', {encoding: "utf8", flag: "r", });

const solve = (cVal) => {
    let register = {a:0,b:0,c:cVal,d:0}
    let currIndex = 0

    const o = {
        cpy: (v,r) => register[r] = isNaN(v) ? register[v] : v,
        inc: (r) => register[r]++,
        dec: (r) => register[r]--,
        jnz: (r,i) => register[r] !== 0 ? currIndex+i : currIndex+1

    }

    let lines = input.split(/\n/).map((x)=>{
        let ins = x.match(/([\w-]+)/g)
        if(ins[0] === 'cpy') return [ins[0],isNaN(ins[1])?ins[1]:+ins[1],ins[2]]
        if(ins[0] === 'jnz') return [ins[0],ins[1],+ins[2]]
        return ins
    })

    let len = lines.length

    while(currIndex<len){
        let [ins,...params] = lines[currIndex]
        let fn = o[ins](...params)
        if(ins !== 'jnz'){
            currIndex++
        } else {
            currIndex = fn
        }
    }

    return register['a']
}

console.log(solve(0))
console.log(solve(1))
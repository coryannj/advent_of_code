const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day23.txt', {encoding: "utf8", flag: "r", });

const solve = (aVal) => {
    let register = {a:aVal,b:0,c:0,d:0}
    let currIndex = 0
    
    let lines = input.split(/\n/).map((x)=>{
        let ins = x.match(/([\w-]+)/g)
        if(ins[0] === 'cpy'||ins[0] === 'jnz'){
            return [ins[0],isNaN(ins[1]) ? ins[1] : +ins[1],isNaN(ins[2]) ? ins[2] : +ins[2]]
        } else {
            return [ins[0],isNaN(ins[1]) ? ins[1] : +ins[1]]
        }
    })

    let len = lines.length

    const o = {
        cpy: (v,r) => {if(isNaN(r)) register[r] = isNaN(v) ? register[v] : v},
        inc: (r) => register[r]++,
        dec: (r) => register[r]--,
        jnz: (r,i) => {
            let cVal = isNaN(r) ? register[r] : r
            let jumpVal = isNaN(i) ? register[i] : i
            return cVal !== 0 ? currIndex+jumpVal : currIndex+1
        },
        tgl: (r) => {
            let tInd = currIndex+register[r]
            
            if(0<=tInd && tInd<len){
                let tVal = lines[tInd]
                if(tVal.length < 3){
                    tVal[0] === 'inc' ? lines[tInd]=['dec',tVal[1]] : lines[tInd]=['inc',tVal[1]]
                } else {
                    tVal[0] === 'jnz' ? lines[tInd]=['cpy'].concat(tVal.slice(1)) : lines[tInd]=['jnz'].concat(tVal.slice(1))
                }
            }
        }

    }



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

console.log(solve(7)) // Part 1
console.log(solve(12)) // Part 2 = not optimised!
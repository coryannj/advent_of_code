const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2018/day19.txt', {encoding: "utf8", flag: "r", });

let [start,...program] = input.split(/\n/g)

pIndex = +(start.replaceAll(/\D/g,''))

program = program.map((x)=>x.match(/\w+/g).map((y,yi)=>yi === 0 ? y : +y))

const solve = (partNo) => {
    let r = Object.fromEntries(Array(6).fill().map((x,i)=>[i,0]))
    
    if(partNo === 2) r[0] = 1

    const ops = {
        addr:(a,b,c) => r[c] = r[a] + r[b],
        addi:(a,b,c) => r[c] = r[a] + b,

        mulr:(a,b,c) => r[c] = r[a] * r[b],
        muli:(a,b,c) => r[c] = r[a] * b,

        banr:(a,b,c) => r[c] = r[a] & r[b],
        bani:(a,b,c) => r[c] = r[a] & b,

        borr:(a,b,c) => r[c] = r[a]|r[b],
        bori:(a,b,c) => r[c] = r[a]|b,

        setr:(a,b,c) => r[c] = r[a],
        seti:(a,b,c) => r[c] = a,

        gtir:(a,b,c) => r[c] = a>r[b] ? 1 : 0,
        gtri:(a,b,c) => r[c] = r[a]>b ? 1 : 0,
        gtrr:(a,b,c) => r[c] = r[c] = r[a]>r[b] ? 1 : 0,

        eqir:(a,b,c) => r[c] = a === r[b] ? 1 : 0,
        eqri:(a,b,c) => r[c] = r[a] === b ? 1 : 0,
        eqrr:(a,b,c) => r[c] = r[a] === r[b] ? 1 : 0
    }

    let currInd = 0

    do{
        r[pIndex] = currInd
        let [op,a,b,c] = program[currInd]
        ops[op](a,b,c)
        currInd = r[pIndex]
        currInd++
    } while(currInd !== 1)

    const notPrime = (n) => {
        let result = 0

        for(i=1;i<=n;i++){
            if(n%i===0) result+=i
        }

        return result
    }

    return notPrime(r[1])
}

console.log(solve(1))
console.log(solve(2))
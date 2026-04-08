const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2018/day16.txt', {encoding: "utf8", flag: "r", });

let [samples,test] = input.split(/\n\n\n/g)

samples = samples.split(/\n\n/g).map((x)=>x.split(/\n/g).map((y)=>y.match(/([-+]?\d+)/g).map(Number)))

const check = (fName,a,b,c,br,partNo = 1) => {
    r = {...br}
   
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

    ops[fName](a,b,c)
    return partNo === 1 ? r[c] : r
}

// Part 1
const findFunctions = ([before,[id,a,b,c],after]) => {
    let beforeRegister = Object.fromEntries(before.map((x,i)=>[i,x]))
    let afterRegister = Object.fromEntries(after.map((x,i)=>[i,x]))

    return ['addr','addi','mulr','muli','banr','bani','borr','bori','setr','seti','gtir','gtri','gtrr','eqir','eqri','eqrr'].filter((k)=>check(k,a,b,c,beforeRegister) === afterRegister[c])
}

samples = samples.map((x,i)=>[x[1][0],findFunctions(x)]).sort((a,b)=>a[0]-b[0])

console.log(samples.filter(([id,opts])=>opts.length>=3).length) // Part 1 answer

// Part 2
let opCodes = Object.fromEntries(Array(16).fill().map((x,i)=>[i,null]))
let foundIds = []
let foundKeys = []

while(samples.some(([id,options])=> options.length === 1)){
    let [id,options] = samples.find(([id,options])=> options.length === 1)
    opCodes[id] = options[0]
    foundIds.push(id)
    foundKeys.push(options[0])
    samples = samples.flatMap(([sId,sOptions])=> foundIds.includes(sId) ? [] : [[sId,sOptions.filter((y)=> !foundKeys.includes(y))]])
}

let p2Register = test
                    .trim().split(/\n/g)
                    .map((x)=> x.match(/\d+/g).map((y,yi)=> yi === 0 ? opCodes[y] : +y))
                    .reduce((register,[fn,a,b,c])=>check(fn,a,b,c,register,2),{0:0,1:0,2:0,3:0})

console.log(p2Register[0])
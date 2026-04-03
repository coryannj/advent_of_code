const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day12.txt', {encoding: "utf8", flag: "r", });


// Part 1
console.log(input.match(/([-+]?\d+)/g).reduce((a,c)=>a+(+c),0))

// Part 2
const getObjVal = (obj) => {
    let vals = Object.values(obj)
    if(vals.includes('red') && !Array.isArray(obj)) return 0
    if(vals.every((x)=>typeof x !== 'object')) return vals.reduce((a,c)=>a+ (typeof c === 'number' ? c : 0),0)
    
    return vals.reduce((a,c)=>{
        if(typeof c === 'number') return a+c
        if(typeof c === 'object') return a+getObjVal(c)
        return a
    },0)
}

console.log(getObjVal(JSON.parse(input)))
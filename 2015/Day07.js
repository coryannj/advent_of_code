const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day07.txt', {encoding: "utf8", flag: "r", });

const int16 = (n) => n & 0xFFFF

let lines = input.split(/\n/g).map((x)=>[x.match(/([A-Z]+)/g)?.[0]||'PROV',x.match(/[0-9a-z]+/g).map((y)=>isNaN(y) ? y : +y)])

const solve = (partNo) => {
    let wires = Object.fromEntries(lines.flatMap((x)=>x.at(-1)).map((x)=>[x,null]))
    
    const ops = {
        'PROV': ([a,b]) => wires[b] = int16(isNaN(a) ? wires[a] : a),
        'AND': ([a,b,c]) => wires[c] = int16((isNaN(a) ? wires[a] : a) & (isNaN(b) ? wires[b] : b)),
        'LSHIFT': ([a,b,c]) => wires[c] = int16((isNaN(a) ? wires[a] : a) << (isNaN(b) ? wires[b] : b)),
        'NOT': ([a,b]) => wires[b] = wires[b] = parseInt((isNaN(a) ? wires[a] : a).toString(2).padStart(16,'0').split('').map((x)=>x === '0' ? '1' : '0').join(''),2),
        'OR': ([a,b,c]) => wires[c] = int16((isNaN(a) ? wires[a] : a) | (isNaN(b) ? wires[b] : b)),
        'RSHIFT': ([a,b,c]) => wires[c] = int16((isNaN(a) ? wires[a] : a) >> (isNaN(b) ? wires[b] : b))
    }

    const findValue = (v) => {
        if(wires[v] !== null) return wires[v]

        let [op,args] = lines.find(([i,a])=>a.at(-1) === v)

        let dependencies = args.slice(0,-1).map((x)=>isNaN(x) ? findValue(x) : x)

        return ops[op](dependencies.concat(args.at(-1)))
    }

    let valueA = findValue('a')

    if(partNo === 1) return valueA
    
    wires = Object.fromEntries(lines.flatMap((x)=>x.at(-1)).map((x)=>[x,null]))
    wires['b'] = valueA
    
    return findValue('a')
}

console.log(solve(1))
console.log(solve(2))
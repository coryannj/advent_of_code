const fs = require("fs");
require("../utils.js");
const { shoelace, md5, gcd, lcm, nextArr, nextArr8 } = require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day17.txt', {encoding: "utf8", flag: "r", });

let [a,b,c,...p] = input.match(/\d+/gs).map(Number)
let programs = p.chunks(2).slice(0,-1)

// Helper functions
function runPrograms(resultObj){
    while(resultObj.regA !== 0n){
        const opLookup = (o,[i,n]) => { return i===1 ? n : BigInt([n,n,n,n,o.regA,o.regB,o.regC,n][n])};
        const opCodes = {
            0: (o,operand) => {o.regA = o.regA/(BigInt(Math.pow(2,Number(operand)))); return o},
            1: (o,operand) => {o.regB = o.regB ^ BigInt(operand); return o},
            2: (o,operand) => {o.regB = operand%BigInt(8); return o},
            4: (o) => {o.regB = o.regB^o.regC; return o},
            5: (o,operand) => {o.output.push(operand%BigInt(8)); return o},
            6: (o,operand) => {o.regB = o.regA/(BigInt(Math.pow(2,Number(operand)))); return o},
            7: (o,operand) => {o.regC = o.regA/(BigInt(Math.pow(2,Number(operand)))); return o}
        }

        resultObj = programs.reduce((a,c)=>{ return opCodes[c[0]](a,opLookup(a,c)) }, resultObj)
    }

    return resultObj
}

// Part 1
let result = {
    regA: BigInt(a),
    regB: BigInt(b),
    regC: BigInt(c),
    output: []
}

console.log('P1 answer is ',runPrograms(result).output.join(','))

// Part 2
let endState = p.slice().map((x)=>BigInt(x))
let currA = BigInt(0)
let p2result = {output:[]}

while(p2result.output.length<endState.length){
    currA*=8n
    currA--
    do{
        currA++
        p2result.regA = currA
        p2result.regB = 0n
        p2result.regC = 0n
        p2result.output = []
        p2result = runPrograms(p2result)
        
    } while (p2result.output.length === 0 || !p2result.output.every((x,ix)=>x === endState.slice(-p2result.output.length)[ix]))
}

console.log('P2 answer is ',currA.toString())
const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day6.txt', {encoding: "utf8", flag: "r", });

let
    nums = input.split(/[\r\n]+/),
    opLine = nums.pop(),
    operators = opLine.matchAll(/\S/g).map((x)=>[x[0],x.index]).toArray(),
    colLen = operators.length,
    lastMatchInd = 0,
    p1 = 0,
    p2 = 0

operators.forEach(([opVal,matchInd],colInd,a)=>{
    let nextMatchInd = colInd < colLen-1 ? a[colInd+1][1] : colLen+1
    let p1Col = colInd < colLen-1 ? nums.map((x)=>x.slice(lastMatchInd,nextMatchInd-1)) : nums.map((x)=>x.slice(lastMatchInd))

    let p2Col = Array.from({ length: p1Col[0].length }, (_, i) => p1Col.map((x)=>x[i]).join(''))

    p1+=(eval(p1Col.join(opVal)))
    p2+=(eval(p2Col.join(opVal)))

    lastMatchInd = nextMatchInd
})

console.log(p1)
console.log(p2)
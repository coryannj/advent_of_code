const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day7.txt', {encoding: "utf8", flag: "r", });

let
    [startRow, ...lines] = input.split(/[\r\n]+/).map((x)=>x.split('')),
    colLen = lines[0].length,
    startCol = startRow.indexOf('S'),
    paths = new Map([[startCol,1]]),
    p1 = 0,
    p2


// Below is little gross bc map keys inserted during forEach will also be iterated over - but it was least perf hit ¯\_(ツ)_/¯

lines.values().filter((x)=>x.includes('^')).forEach((line)=>{
    paths.keys().forEach((k)=>{ 
        if(line[k] === '^'){
            p1++
            let prevVal = paths.get(k)

            if(k-1>=0){
                let lKey = k-1
                paths.has(lKey) ? paths.set(lKey,paths.get(lKey)+prevVal) : paths.set(lKey,prevVal)
            }
            
            if(k+1<colLen){
                let rKey = k+1
                paths.has(rKey) ? paths.set(rKey,paths.get(rKey)+prevVal) : paths.set(rKey,prevVal)
            }

            paths.delete(k)
        }
    })
})

p2 = paths.values().reduce((a,c)=>a+c)

console.log('Part 1 answer is ',p1)
console.log('Part 2 answer is ',p2)
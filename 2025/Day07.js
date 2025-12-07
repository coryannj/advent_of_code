const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day7.txt', {encoding: "utf8", flag: "r", });

let
    lines = input.split(/[\r\n]+/).map((x)=>x.split('')),
    colLen = lines[0].length,
    startRow = lines.shift(),
    startCol = startRow.indexOf('S'),
    paths = new Map([[startCol,1]]),
    p1 = 0,
    p2

// Below is little gross bc map keys inserted during forEach will also be iterated over - but it was least perf hit ¯\_(ツ)_/¯

lines.filter((x)=>x.includes('^')).forEach((line)=>{
    paths.keys().forEach((k)=>{ 
        if(line[k] === '^'){
            let
                prevVal = paths.get(k),
                lKey=k-1,
                rKey=k+1

            p1++

            if(lKey >= 0) paths.set(lKey, prevVal + (paths?.get(lKey) ?? 0));
    
            if(rKey < colLen) paths.set(rKey, prevVal + (paths?.get(rKey) ?? 0));
            
            paths.delete(k)
        }
    })
})

p2 = paths.values().reduce((a,c)=>a+c)

console.log('Part 1 answer is ',p1)
console.log('Part 2 answer is ',p2)
const fs = require('fs');
const input = fs.readFileSync('../2016/day4input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=>x.slice(0,-1).split(/[\W]+/)).map((x)=>[x.at(-1),parseInt(x.at(-2)),x.slice(0,-2)])

const count = (arr) => arr.reduce((acc, curr) => {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
}, {});

// Part 1
let sum = 0

lines.forEach(([checksum,sectorId,letters])=>{
    let counts = count(letters.join('').split(''))

    if(checksum === Object.entries(counts).sort((a,b)=>b[1]===a[1] ? a[0].localeCompare(b[0]) : b[1]-a[1]).slice(0,5).map((x)=>x[0]).join('')){
        sum+=sectorId
    }
    
})

console.log(sum)

// Part 2

let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

lines.forEach(([checksum,sectorId,letters])=>{
    let code = letters.map((x)=>x.split('').map((y)=>alphabet[(alphabet.indexOf(y)+sectorId)%26]).join('')).join(' ')

    if(code === 'northpole object storage'){
        console.log(sectorId)
    }
})
const fs = require('fs');
const input = fs.readFileSync('../2016/day6input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=>x.split(''))

const count = (arr) => arr.reduce((acc, curr) => {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
  }, {});

let result = ''
let result2 = ''
for(i=0;i<lines[0].length;i++){
    let counts = count(lines.map((x)=>x[i]));
    let sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
    
    result += sorted[0][0];
    result2 += sorted.at(-1)[0];
}

console.log(result) // Part 1 answer
console.log(result2) // Part 2 answer
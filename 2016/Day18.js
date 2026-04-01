const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day18.txt', {encoding: "utf8", flag: "r", });

const solve = (rows) => {
    const rules = {
                    '^^.':'^',
                    '.^^':'^',
                    '^..':'^',
                    '..^':'^',
                    '.^.':'.',
                    '...':'.',
                    '^^^':'.',
                    '^.^':'.'
                }

    let 
        currRow = input.split(''),
        safe = currRow.filter((x)=>x==='.').length

    while(--rows){
        currRow = currRow.map((x,i,a)=> rules[`${a[i-1]||'.'}${x}${a[i+1]||'.'}`])
        safe+=currRow.filter((x)=>x==='.').length
    }

    return safe
}

console.log(solve(40))
console.log(solve(400000))
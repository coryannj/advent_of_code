const fs = require('fs');
const input = fs.readFileSync('../day9input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split('')
let p1lines = lines.slice()

let depth = 0
let garbage = 0
let score = 0
let garbagescore = 0

while(p1lines.length>0){
    let next = p1lines.shift()

    if(garbage === 0){
        if(next === '{'){
            score += ++depth
            continue;
        }

        if(next === '}'){
            depth--
            continue;
        }

        if(next === '<'){
            garbage++
        }

    } else {
        if(next === '!'){
            p1lines.shift()
            continue;
        } else if(next === '>'){
            garbage--
            continue;
        } else {
            garbagescore++
        }
    }

}
console.log(score) // Part 1
console.log(garbagescore) // Part 2

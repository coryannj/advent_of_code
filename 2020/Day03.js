const fs = require('fs');
const input = fs.readFileSync('../day3input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=> x.split(''))

let rowlen = lines.length
let collen = lines[0].length

function toboggan(right,down){
    let toboggan = [0+down,0+right]
    let treeCount = 0

    while(toboggan[0]<rowlen){    
        if(lines[toboggan[0]][toboggan[1]] === '#') treeCount++ ;
        
        toboggan[0]+= down;
        toboggan[1] = (toboggan[1]+right)%collen;
    }

    return treeCount
}

let slope1 = toboggan(1,1)
let slope2 = toboggan(3,1)
let slope3 = toboggan(5,1)
let slope4 = toboggan(7,1)
let slope5 = toboggan(1,2)

console.log(slope2) // Part 1
console.log([slope1,slope2,slope3,slope4,slope5].reduce((acc,curr)=>acc*curr,1)) // Part 2

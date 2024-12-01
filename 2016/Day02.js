const fs = require('fs');
const input = fs.readFileSync('../2016/day2input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=>x.split(''))

let keypad = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
]

let keypad2 = [
    ['.', '.', 1, '.', '.'],
    ['.', 2, 3, 4, '.'],
    [5,6,7,8,9,],
    ['.','A','B','C','.'],
    ['.','.','D','.','.']
]

const move = ([r,c],dir,partNo) => {
    let moveObj={
        'U':[r-1,c],
        'D':[r+1,c],
        'R':[r,c+1],
        'L':[r,c-1]
    }

    let next = moveObj[dir]
    if(partNo === 1){
        return next.every((x)=> 0 <= x && x <= 2) ? next : [r,c]
    } else {
        return next.every((x)=> 0 <= x && x <= 4) && keypad2[next[0]][next[1]] !== '.' ? next : [r,c]
    }
}

// Part 1/2
let button = [1,1]
let code = []

let button2 = [2,0]
let code2 = []

lines.forEach((line)=>{
    line.forEach((d)=>{
        button = move(button,d,1)
        button2 = move(button2,d,2)
    })
    code.push(button)
    code2.push(button2)
})

console.log(code.map(([r,c])=>keypad[r][c]).join('')) // Part 1 answer
console.log(code2.map(([r,c])=>keypad2[r][c]).join('')) // Part 2 answer
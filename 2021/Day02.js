const fs = require('fs');
const input = fs.readFileSync('../day2input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=> x.split(' ')).map((y)=> [y[0],parseInt(y[1])])
let linesLen = lines.length

let p1Directions = lines.slice()

let row = 0
let col = 0

while(p1Directions.length>0){
    let [dir,steps] = p1Directions.shift()

    if (dir === 'forward'){
        col+=steps
        continue;
    }

    if (dir === 'up'){
        row-=steps
        continue;
    }

    if (dir === 'down'){
        row+=steps
        continue;
    }

}

console.log(row,col,row*col) // Part 1

let p2Directions = lines.slice()

let p2row = 0
let p2col = 0
let p2aim = 0

while(p2Directions.length>0){
    let [dir,steps] = p2Directions.shift()

    if (dir === 'forward'){
        p2col+=steps
        p2row+=(p2aim*steps)
        continue;
    }

    if (dir === 'up'){
        p2aim-=steps
        continue;
    }

    if (dir === 'down'){
        p2aim+=steps
        continue;
    }

}

console.log(p2row,p2col,p2row*p2col) // Part 1
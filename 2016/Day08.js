const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day08.txt', {encoding: "utf8", flag: "r", });

let grid = Array(6).fill().map((x)=>Array(50).fill('.').map(x=>x))
let lines = input.split(/\n/)

lines.forEach((x)=>{
    let [instruction,...details] = x.match(/(\w+)/g)
    
    if(instruction === 'rect'){
        let [c,r] = details[0].split('x').map(Number)
        for(i=0;i<r;i++){
            for(j=0;j<c;j++){
                grid[i][j] = '#'
            }
        }
    } else {
        if(details[0] === 'row'){
            let row = +details[2]
            let shift = +details[4]
            grid[row] = grid[row].slice(-shift).concat(grid[row]).slice(0,50)

        } else {
            let col = +details[2]
            let shift = +details[4]

            let ogCol = grid.map((x)=>x[col])
            let newCol = ogCol.slice(-shift).concat(ogCol).slice(0,6)

            for(i=0;i<6;i++){
                grid[i][col] = newCol[i]
            }
        }
    }
})

console.log(grid.flatMap((x)=>x.flatMap((y)=>y==='#'?['#']:[])).length) // Part 1
grid.forEach((x)=>console.log(x.join(''))) // Part 2
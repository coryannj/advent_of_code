const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day18.txt', {encoding: "utf8", flag: "r", });

const solve = (input,partNo) => {
    let grid = input.split(/\n/g).map((x)=>x.split(''))
    let maxRow = grid.length-1
    let maxCol = grid[0].length-1
    let corners = [[0,0],[0,maxCol],[maxRow,0],[maxRow,maxCol]]
    let steps = 100

    if(partNo === 2){
        corners.forEach(([r,c])=>grid[r][c] = '#')
    }

    const neighbours = (r,c,partNo) => {
        if(partNo === 2 && corners.some(([cr,cc])=>cr === r && cc === c)) return '#'
        
        let on = [[r-1,c-1],[r-1,c],[r-1,c+1],[r,c+1],[r+1,c+1],[r+1,c],[r+1,c-1],[r,c-1]].filter(([nr,nc])=>grid?.[nr]?.[nc] === '#').length
        
        if(grid[r][c] === '#'){
            return on === 2 || on === 3 ? '#' : '.'
        } else {
            return on === 3 ? '#' : '.'
        }
    }
    
    while(steps--){
        grid = grid.map((x,xi)=>x.map((y,yi)=>neighbours(xi,yi,partNo)))
    }

    return grid.flat().filter((x)=>x==='#').length
}

console.log(solve(input,1))
console.log(solve(input,2))
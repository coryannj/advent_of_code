const fs = require('fs');
const input = fs.readFileSync('../day21input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=> x.split(''))
let xlength = lines.length
let ylength = lines[0].length

// Manually determine start co-ord (too lazy to code)
let startx = lines.findIndex((x)=> x.includes('S')) 
let starty = lines[startx].findIndex((x)=> x === 'S')
lines[startx][starty] = '.'

let steplimit = 63
let steps = 0


// Part 1

 let queue = [[startx,starty+1],[startx,starty-1],[startx-1,starty],[startx+1,starty]].map((x)=> x.join('-'))

function getNext(coord) {
  let [x,y] = coord.split('-').map(Number)
  //console.log(x,y)

    let nextArray = [[x,y+1],[x,y-1],[x-1,y],[x+1,y]].filter((z)=> lines[z[0]][z[1]] === '.')
    //console.log(nextArray)
    return nextArray.map((a)=> a.join('-')) // filters out negative values
  }


while (steps < steplimit) {
  steps++ ;

  let newQueue = queue.flatMap((x)=> getNext(x))
  queue = [... new Set(newQueue)];
}

queue.forEach((el)=> {
  let [x,y] = el.split('-').map(Number)
  lines[x][y] = '0'

})

console.log('Part 1 answer is ',queue.length) // Part 1

lines.forEach(el=> console.log(el.join('')))



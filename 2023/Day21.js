const fs = require('fs');
const input = fs.readFileSync('../day21input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/[\r\n]+/).map((x)=> x.split(''))
let xlength = lines.length
let ylength = lines[0].length

// Part 1

// Get starting point
let startx = lines.findIndex((x)=> x.includes('S')) 
let starty = lines[startx].findIndex((x)=> x === 'S')
lines[startx][starty] = '.'

function getNext(coord) {
  let [x,y] = coord.split('-').map(Number)
  let nextArray = [[x,y+1],[x,y-1],[x-1,y],[x+1,y]].filter((z)=> z[0]>=0 && z[0]<= xlength-1 && z[1]>=0 && z[1]<=ylength-1 && lines[z[0]][z[1]] === '.')
  return nextArray.map((a)=> a.join('-'))
}

function howManyPlots(startKey,steps) {
  var queue = [startKey]
  var stepsTaken = 0

  while (stepsTaken < steps) {
    stepsTaken++ ;
    let newQueue = queue.flatMap((x)=> getNext(x));
    queue = [... new Set(newQueue)];
  }

  // --- TO PRINT THE GRID ---
  // queue.forEach((el)=> {
  //   let [x,y] = el.split('-').map(Number)
  //   lines[x][y] = '0'
  // })
  
  return queue.length
}

// lines.forEach(el=> console.log(el.join(''))) // To print grid

let p1 = howManyPlots(`${startx}-${starty}`,64)
console.log(p1) // Part 1 answer

// Part 2 - shamelessly taken from https://github.com/villuna/aoc23/wiki/A-Geometric-solution-to-advent-of-code-2023,-day-21

let p2steplimit = 26501365
let grids = ((p2steplimit-65)/131)

let oddDiamond = howManyPlots(`${startx}-${starty}`,65)

let evenWholeGrid = howManyPlots('0-0',262)
let oddWholeGrid = howManyPlots('0-0', 263)

let evenTopLeft = howManyPlots('0-0',64) // even corners need to be calculated manually bc of some weird # placement
let evenTopRight = howManyPlots(`0-${ylength-1}`,64)
let evenBottomLeft = howManyPlots(`${xlength-1}-0`,64)
let evenBottomRight = howManyPlots(`${xlength-1}-${ylength-1}`,64)

let evenCorners = evenTopLeft + evenTopRight + evenBottomLeft + evenBottomRight
let oddCorners = oddWholeGrid - oddDiamond

let oddInnerGrids = ((grids+1)*(grids+1)) * oddWholeGrid
let evenInnerGrids = (grids*grids) * evenWholeGrid
let oddBorderDiamonds = (grids+1) * oddCorners
let evenBorderCorners = grids * evenCorners

let p2 = oddInnerGrids+evenInnerGrids-oddBorderDiamonds+evenBorderCorners

console.log(p2) // Part 2 answer
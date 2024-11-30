const fs = require('fs');
const input = fs.readFileSync('../day16input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=> x.split(''))

const coordRegex = /\d+[,]\d+/gm
let xlength = lines.length
let ylength = lines[0].length

// Part 1

/* Model is for every step incoming [x-coordinate,y-coordinate,direction] -> encounter -> outgoing[x-coordinate,y-coordinate,direction] (where outgoing can be multiple) */

let start = [[0,0,'R']]

function getNext([x,y,direction]) {

  let encounter = lines[x][y]

  let right = [x,y+1,'R'],
      left = [x,y-1,'L'],
      up = [x-1,y,'U'],
      down = [x+1,y,'D']

  let nextmap = {
    '.': {'R':[right],'L': [left], 'U': [up], 'D':[down]},
    '-': {'R':[right],'L': [left], 'U': [right,left], 'D':[right,left]},
    '|': {'R':[up,down],'L': [up,down], 'U': [up], 'D':[down]},
    '/': {'R':[up],'L':[down],'U':[right],'D':[left]},
    '\\':{'R':[down],'L':[up],'U':[left],'D':[right]}
  }
  return nextmap[encounter][direction].filter((z)=> (z[0]>=0 && z[0]<xlength) && (z[1]>=0 && z[1]<ylength)) // filters out negative values
}

function nextBeam(arrofarrs) {
  let seen = []
  let seenlines = input.split(/[\r\n]+/).map((x)=> x.split(''))
  let thisarrofarrs = arrofarrs

  while (thisarrofarrs.length > 0) {
    let nextdirections = []
    for (step of thisarrofarrs) {
        let nextarr=[]
        if (seen.includes(step.join(',')) === false) {
          let encounter = lines[step[0]][step[1]]
          if (encounter === '-' && (step[2]==='up' || step[2] === 'down')) {
            seen.push([step[0],step[1],'up'].join(','))
            seen.push([step[0],step[1],'down'].join(','))
          } else if (encounter === '|' && (step[2]==='left' || step[2] === 'right')) {
            seen.push([step[0],step[1],'left'].join(','))
            seen.push([step[0],step[1],'right'].join(','))
          } else {
            seen.push(step.join(','))
          }
          seenlines[step[0]][step[1]] = 'S'
          nextarr = getNext(step)
          if (nextarr.length>0) {
            if (nextarr.length === 1) {
              nextdirections.push(nextarr[0])
            } else {
            nextdirections.push(nextarr[0]);
            nextdirections.push(nextarr[1]);
            }
          }
        }  
      }
    thisarrofarrs = nextdirections
  }
  return seenlines.flat().filter((x)=> x==='S').length
}

console.log(nextBeam(start)) // Part 1 answer

//Part 2

let part2start=[]

//top and bottom rows start positions
for(i=0;i<ylength;i++){
  part2start.push([0,i,'D']);
  part2start.push([ylength-1,i,'U'])
}

//right and left cols start positions
for(i=0;i<xlength;i++) {
  part2start.push([i,0,'R'])
  part2start.push([i,xlength-1,'L'])
}

let currmax=0

// Loop through all possible edge co-ords/directions to get all possible routes and take max
for (item of part2start) {
  thisstart = [item]
  let thismax = nextBeam(thisstart)
  thismax > currmax ? currmax=thismax : currmax=currmax
}

console.log(currmax)
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
  //console.log('nextmap',nextmap[encounter][direction].filter((z)=> (z[0]>=0 && z[0]<xlength) && (z[1]>=0 && z[1]<ylength)))
  return nextmap[encounter][direction].filter((z)=> (z[0]>=0 && z[0]<xlength) && (z[1]>=0 && z[1]<ylength)) // filters out negative values
}

function nextBeam(arrofarrs) {
  let seen = []
  let seenlines = input.split(/[\r\n]+/).map((x)=> x.split(''))
  let thisarrofarrs = arrofarrs

  while (thisarrofarrs.length > 0) {
    let nextdirections = []
    for (step of thisarrofarrs) {
      //console.log('step is',step)
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
          //console.log('nextarr is',nextarr)
          if (nextarr.length>0) {
            if (nextarr.length === 1) {
              nextdirections.push(nextarr[0])
            } else {
            nextdirections.push(nextarr[0]);
            nextdirections.push(nextarr[1]);
            }
          }
        } 

        // if (seen.includes(step.join(',')) === false) {
        //   seen.push(step.join(','))
        //   seenlines[step[0]][step[1]] = 'S'
        //   nextarr = getNext(step)
        //   //console.log('nextarr is',nextarr)
        //   if (nextarr.length>0) {
        //     if (nextarr.length === 1) {
        //       nextdirections.push(nextarr[0])
        //     } else {
        //     nextdirections.push(nextarr[0]);
        //     nextdirections.push(nextarr[1]);
        //     }
        //   }
        // } 
      }
      //console.log('nextdirections is',nextdirections)
    thisarrofarrs = nextdirections
  }

  let seenmap = seen.map((z)=> z.match(coordRegex).join(''))
//   console.log('**************-SEEN-**************')
// console.log(seen.length)
// console.log(seen)
// console.log('**************-SEENMAP-**************')
// console.log(seenmap)
 //console.log('**************-SEENLINES_ARRAY-**************')
 //console.log(seenlines.map((x)=> x.join('')))
 //console.log(seenlines.flat().filter((x)=> x==='S').length)
 // let energised = new Set (seenmap)
 //console.log('energised is ',energised)
 //console.log('energised size is',energised.size)
 // return energised.size
 return seenlines.flat().filter((x)=> x==='S').length

}

console.log(nextBeam(start))


// console.log('**************-SEEN-**************')
// console.log(seen.length)
// console.log(seen)
// console.log('**************-SEENMAP-**************')
// console.log(seen.map((z)=> [z[0],z[1]].join(',')))
// console.log('**************-ARRAY-**************')
// console.log(seenlines.map((x)=> x.join('')))
// let seenmap = seen.map((z)=> [z[0],z[1]].join(','))
// let energised = new Set (seenmap)
// console.log('energised is ',energised)
// console.log('energised size is',energised.size)



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

//console.log(part2start)

let currmax=0
for (item of part2start) {
  console.log('start is ',item)
  //console.log('seen is',seen)
  thisstart = [item]
  let thismax = nextBeam(thisstart)
  console.log('currmax is',currmax,' thismax is',thismax)
  thismax > currmax ? currmax=thismax : currmax=currmax
}

console.log(currmax)
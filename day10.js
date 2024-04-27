const fs = require('fs');
const input = fs.readFileSync('../day10input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=> x.split(''))

const coordRegex = /\d+[,]\d+/gm
let xlength = lines.length
let ylength = lines[0].length

//console.log(lines[0])
let startx = lines.findIndex((x)=> x.includes('S'))
let starty = lines[128].findIndex((x)=> x === 'S')
//console.log(lines[93][78])
// Part 1

/* Model is for every step incoming [x-coordinate,y-coordinate,direction] -> encounter -> outgoing[x-coordinate,y-coordinate,direction] (where outgoing can be multiple) */

let queue = [[127,88,'U'],[129,88,'D']]
let distance = 0
let seen = ['128-88']

console.log(queue[0].join('-').includes('128-88'))

function getNext([x,y,direction]) {

  let nextmap = {
    '|_U': [x-1,y,'U'],
    '|_D': [x+1,y,'D'],
    '-_R': [x,y+1,'R'],
    '-_L': [x,y-1,'L'],
    'L_D': [x,y+1,'R'],
    'L_L': [x-1,y,'U'],
    'J_R': [x-1,y,'U'],
    'J_D': [x,y-1,'L'],
    '7_R': [x+1,y,'D'],
    '7_U': [x,y-1,'L'],
    'F_U': [x,y+1,'R'],
    'F_L': [x+1,y,'D']
  }
  return nextmap[`${lines[x][y]}_${direction}`].flat() 
}

while (seen.indexOf(`${queue[0][0]}-${queue[0][1]}`) === -1 && seen.indexOf(`${queue[1][0]}-${queue[1][1]}`) === -1) {
  seen.push(`${queue[0][0]}-${queue[0][1]}`)
  seen.push(`${queue[1][0]}-${queue[1][1]}`)
  distance++
  queue = queue.map((x)=> getNext(x))
}

console.log(distance) // Part 1 answer
console.log(seen.length)

//Part 2
// let seenMap = seen.map((x)=> {
//   let coords = x.split('-').map(Number)
//   return `${x}-${lines[coords[0]][coords[1]]}`
// })

// console.log(seenMap[0])
// console.log(seenMap[1])
// console.log(seenMap[seenMap.length-1])
// console.log(seenMap[seenMap.length-2])
// console.log(seenMap[seenMap.length-3])
// console.log(seenMap[seenMap.length-4])
console.log(seen[seen.length-1])
console.log(seen[seen.length-2])

let queue2 = [[127,88,'U']]
let seen2 = []
let vertices = []
let straight = []
let count2 = 0
// Shoelace formula - taken from https://stackoverflow.com/questions/62323834/calculate-polygon-area-javascript
function calculateArea(coords) {
  let area = 0;

  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];

    area += x1 * y2 - x2 * y1
  }

  //return area / 2;
  // replace with
 return Math.abs(area) / 2;
}

while(!queue2[0].join('-').includes('128-88')) {
  let next = lines[queue2[0][0]][queue2[0][1]]
  count2++

  seen2.push([queue2[0][0],queue2[0][1]])
  if (next !== '|' && next !== '-') {
    vertices.push([queue2[0][0],queue2[0][1]])
  } else {
    straight.push([queue2[0][0],queue2[0][1]])
  }

  queue2 = queue2.map((x)=> getNext(x))

}
console.log('count2 is ',count2)
//console.log(vertices)
// console.log(vertices.length)
// console.log(straight.length)
// console.log(seen2.length)
// console.log(seen2[seen2.length-1])
// console.log(seen2[seen2.length-2])
// console.log(calculateArea(vertices))
// console.log(calculateArea(seen2))

let internalArea = calculateArea(vertices)
let border = ((seen.length-1)/2)-1
console.log(internalArea-border) // Part 2 answer
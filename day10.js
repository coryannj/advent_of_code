const fs = require('fs');
const input = fs.readFileSync('../day10input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=> x.split(''))

// Manually determine start co-ord (too lazy to code)
let startx = lines.findIndex((x)=> x.includes('S')) 
let starty = lines[128].findIndex((x)=> x === 'S')

// Part 1

/* Model is for every step incoming [x-coordinate,y-coordinate,direction] -> encounter -> outgoing[x-coordinate,y-coordinate,direction] (where outgoing can be multiple) */

let queue = [[127,88,'U']]
let distance = 0
let seen = [[128,88]]

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

// Loop all around the grid till we reach start
while (!queue[0].join('-').includes('128-88')) {
  seen.push([queue[0][0],queue[0][1]]) // Push all points as [x,y] into seen array for Part 2
  queue = queue.map((x)=> getNext(x))
}

console.log(seen.length/2) // Part 1 answer

//Part 2

// Shoelace formula - taken from https://stackoverflow.com/questions/62323834/calculate-polygon-area-javascript
function calculateArea(coords) {
  let area = 0;

  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];

    area += x1 * y2 - x2 * y1
  }

 return Math.abs(area) / 2;
}

let totalArea = calculateArea(seen) // Shoelace
let border = ((seen.length)/2)-1 // Pick's theorem
console.log(totalArea-border) // Part 2 answer
const fs = require('fs');
const input = fs.readFileSync('../day18input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((y)=> {
  let ysplit = y.split(' ')
  let hex = parseInt(ysplit[2].substring(2,7),16)
  let map = 'RDLU'
  return [ysplit[0],parseInt(ysplit[1]),parseInt(ysplit[2].substring(2,7),16),map.charAt(parseInt(ysplit[2].charAt(7)))]
  
})

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

function getNext(x,y,direction,distance) {
  let nextmap = {
    'R': [x,y+distance],
    'D': [x+distance,y],
    'L': [x,y-(distance)],
    'U': [x-(distance),y],
  }
  return nextmap[direction]
}

// Part 1 and 2

let p1start = [10000,10000];
let p1seen = [];

let p2start = [10000,10000];
let p2seen = [];

// Loop all around the grid till we reach start
for(i=0;i<lines.length;i++) {
  let [p1dir,p1dist,p2dist,p2dir] = lines[i];
  p1seen.push(p1start);
  p2seen.push(p2start);
  p1start = getNext(p1start[0],p1start[1],p1dir,p1dist);
  p2start = getNext(p2start[0],p2start[1],p2dir,p2dist);
}

p1seen.push(p1start)
let p1totalArea = calculateArea(p1seen) // Shoelace
let p1borderSum = lines.flatMap((x)=> x[1]).reduce((acc,curr)=> acc+curr)
let p1border = (p1borderSum/2)+1 // Pick's theorem
console.log(p1totalArea+p1border) // Part 1 answer

p2seen.push(p2start)
let p2totalArea = calculateArea(p2seen) // Shoelace
let p2borderSum = (lines.flatMap((x)=> x[2]).reduce((acc,curr)=> acc+curr))
let p2border = (p2borderSum/2)+1 // Pick's theorem
console.log(p2totalArea+p2border) // Part 2 answer
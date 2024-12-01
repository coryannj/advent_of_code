const fs = require('fs');
const input = fs.readFileSync('../day11input.txt',{ encoding: 'utf8', flag: 'r' });

//Part 1
const galaxies = input.split(/[\r\n]+/)


//Get indexes of rows without galaxies
let nogalrows = galaxies.map((x,index)=> !x.includes('#')? parseInt(index):'').filter((y)=>y>0)

let nogalcols=[]
let coords = []

// Get indexes of cols without galaxies and map galaxy co-ords
for(i=0;i<galaxies[0].length;i++) {
  galaxies.map((x)=> x[i]).join('').includes('#') === true ? '':nogalcols.push(i)
  for(j=0;j<galaxies.length;j++) {
   galaxies[i][j] === '#' ? coords.push([i,j]): ''
  }
}

// Set coords for part 2 since we're going to mutate original array
let part2coords=[...coords]

pathcounter=0
paircounter=0

// Calculate diff between x or y coord
function difference(a, b) {
  return Math.abs(a - b);
}

// Function to work out steps - expander is whatever the nogalcols/rows is worth
function getShortest(array1,array2,expander) {
  let xdistance = difference(array1[0],array2[0])
  let ydistance = difference(array1[1],array2[1])
  let extrarows = array1[0]=== array2[0] ? 0 : nogalrows.filter((x)=> (x>Math.min(array1[0],array2[0]) && x<Math.max(array1[0],array2[0]))).length * expander
  let extracols = array1[1]=== array2[1] ? 0 : nogalcols.filter((x)=> (x>Math.min(array1[1],array2[1]) && x<Math.max(array1[1],array2[1]))).length * expander
  return xdistance+ydistance+extrarows+extracols
}

// Get paths for all the pairs
while(coords.length>1) {
  let thisgal = coords.shift()
  let othergals = coords

  for (othergal of othergals) {
    paircounter++
    pathcounter = pathcounter+getShortest(thisgal,othergal,1)
  }
}
console.log(pathcounter) // Part 1 answer

// Part 2
pathcounter2=0
paircounter2=0

// Get paths for all the pairs
while(part2coords.length>1) {
  let thisgal = part2coords.shift()
  let othergals = part2coords

  for (othergal of othergals) {
    paircounter2++
    pathcounter2 = pathcounter2+getShortest(thisgal,othergal,999999)
  }
}
console.log(pathcounter2) // Part 2 answer







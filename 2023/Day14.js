const fs = require('fs');
const input = fs.readFileSync('../day14input.txt',{ encoding: 'utf8', flag: 'r' });

//Part 1
const mirrors = input.split(/[\r\n]+/)

let numrows = mirrors.length
let loadsum = 0

function northLoad(array) {
  let thislength = array.length
  let loadsum = 0
  
  // Scroll through each column - if you don't hit a '#' then first '0' is 10,9 etc. otherwise set loadvalue to '#' row+1
  for(i=0;i<array[0].length;i++) {
    let startload = thislength
    for (j=0;j<thislength;j++) {
      if (array[j][i] === '#') {
        startload=thislength-(j+1)
      }
      if (array[j][i] === 'O') {
        loadsum = loadsum+startload
        startload = startload-1
      }
    }
  }
  
  return loadsum // Part 1 answer
}

console.log(northLoad(mirrors)) // Part 1 answer

// Part 2

let cyclecounter=0
let mirrors2 = mirrors.map((x)=> x.split(''))
let mirrorlength = mirrors2.length
let mirrorSet = [] // arrays we've seen
mirrorSet.push(mirrors.join(''))
let foundindex = [] // indexes in the cycle
let loadset = [] //load values in the cycle

function getLoad(array) {
  let loadcounter = 0
  let arraylength = array.length
  for ([ind,row] of array.entries()) {
    for (val of row) {
      if (val==='O') {
        loadcounter=loadcounter+(arraylength-ind)
      }

    }
  }
  return loadcounter
}

// Gets tilt for either 'north' or 'west' (will transpose array and use same function for south & east)
function tiltLeverNW (direction) {
  for(i=0;i<mirrorlength;i++) {
    let tiltindex = 0 // where any found 'O' should be placed
    let x
    let y
    let xdirection
    let ydirection

    for (j=0;j<mirrorlength;j++) {
      if (direction === 'north') {x=j;y=i,xdirection='+1',ydirection='0'}
      if (direction === 'west') {x=i;y=j,xdirection='0',ydirection='+1'}
      
      if (mirrors2[x][y] === '#') {
        tiltindex=j+1 // next 'O' should be placed after the '#'
      } else if (mirrors2[x][y] === 'O') {
        
        // If tiltindex is lower we need to move the O up, and replace its current position with '.' otherwise leave where it is
        if (j !== tiltindex) {  
          if (xdirection !== '0') { 
            tx = tiltindex; 
            ty=y 
          } else {
            tx = x
            ty = tiltindex
          }
          mirrors2[tx][ty] = 'O'
          mirrors2[x][y] = '.'
        }
        tiltindex++ // next 'O' should be placed after this one
      }      
    }
  }  
 return mirrors2
}

// Cycles through all four tilts, saves array/load/seenindex to get answer
function cycles(number) {
  let n = 0
  let firstseen
  while (n<number) {
  tiltLeverNW('north')
  tiltLeverNW('west')
  mirrors2.reverse().map((x)=> x.reverse()) // rotates array 180 degrees
  tiltLeverNW('north') // South
  tiltLeverNW('west') // East
  mirrors2.reverse().map((x)=> x.reverse()) // rotates array back
  cyclecounter++

  let aftercycle = mirrors2.map((x)=> x.join('')) // Make current array a string to add to seen arrays
 
  // If we have seen array - add index + load value to sep arrays so we can identify cycle length (you could also just math it from first seen)
  if (mirrorSet.includes(aftercycle.join('')) === true) {
    let foundind = mirrorSet.findIndex((x)=>x===aftercycle.join(''))
    let foundload = getLoad(mirrors2)
    
    if (foundindex.length === 0) {
      firstseen = cyclecounter // sets value for first time we saw a repeat
    }

    if (foundindex.includes(foundind)) {
      //console.log('we found the cycle!!!!!',foundind,foundload,' already in seen arrays')
      break;
    } else {
      foundindex.push(foundind)
      loadset.push(foundload)
      //console.log('indexes in cycle are',foundindex)
      //console.log('load values in cycle are',loadset)
    }
  } else {
    mirrorSet.push(aftercycle.join(''))
    //console.log('Not found,counter is ',cyclecounter, 'and mirrorset size is ',mirrorSet.length)
  }
    n++
  }
  console.log('indexes in cycle are',foundindex)
  console.log('load values in cycle are',loadset)
  console.log('offset is ',firstseen)
  console.log('cycle length is ',foundindex.length)
  let remainder = (1000000000-firstseen)%(foundindex.length)
  return loadset[remainder]
}

console.log(cycles(1000000000)) //Part 2 answer

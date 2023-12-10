const fs = require('fs');
const input = fs.readFileSync('../day6input.txt',{ encoding: 'utf8', flag: 'r' });
const races = input.split(/[\r\n]+/)


// Part 1

// Regexes
const numregex = /\d+/gm

const timespart1 = races[0].match(numregex).map((x) => parseInt(x))
const distancespart1 = races[1].match(numregex).map((x) => parseInt(x))

const timespart2 = [timespart1.join('')].map((x) => parseInt(x))
const distancespart2 = [distancespart1.join('')].map((x) => parseInt(x))

function getWinning(timesarray,distancesarray) {
  let resultArray = []

  for (let i=0;i<timesarray.length;i++) {
    let minspeed = Math.floor(distancesarray[i]/timesarray[i])
    let speeds = Array.from({length: timesarray[i]}, (_, i) => i + 1).filter((x)=> x>minspeed)
    let winningways = 0
    for (speed of speeds) {
      if (distancesarray[i] < (speed * (timesarray[i]-speed))) {
        winningways++
      }
    }
    resultArray.push(winningways)
    
  }
  return resultArray.reduce((acc,curr) => acc * curr,1)
}

console.log(getWinning(timespart1,distancespart1))
console.log(getWinning(timespart2,distancespart2))


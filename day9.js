const fs = require('fs');
const input = fs.readFileSync('../day9input.txt',{ encoding: 'utf8', flag: 'r' });

//Part 1
const histories = input.split(/[\r\n]+/).map((x)=>x.match(/\S+/gm).map(Number))

const allEqual = arr => arr.every(val => val === arr[0]);

counter = 0

function differences (array) {
  let lastnums=[]
  lastnums.push(array[array.length-1])
  let report = array
  let nextline

  while(allEqual(report)===false) {
    nextline=[]
    for(i=0;i<report.length-1;i++) {
      nextline.push(report[i+1]-report[i])
    }
    lastnums.push(nextline[nextline.length-1]) // we only need to sum last number of each line for prediction
    report=nextline
  }
  counter = counter + (lastnums.reduce((acc,curr) => acc+curr,0)) // Adds prediction to counter
}

for (history of histories) {
  differences(history)
}

console.log(counter) // Part 1 answer

//Part 2

part2counter = 0

//Function to get first prediction for each
function firstdifferences (array) {
  let firstnums=[]
  firstnums.push(array[0])
  let report = array
  let nextline

  while(allEqual(report)===false) {
    nextline=[]
    for(i=0;i<report.length-1;i++) {
      nextline.push(report[i+1]-report[i])
    }
    firstnums.push(nextline[0]) // we only need first number of each line for prediction
    report=nextline
  }

  firstnums.reverse()

  let secondcounter = 0
  for(i=0;i<firstnums.length;i++) {
    let getint = firstnums[i]-secondcounter
    secondcounter = getint
  }

  part2counter = part2counter+secondcounter // Adds prediction to counter
}

for (history of histories) {
  firstdifferences(history)
}

console.log(part2counter) // Part 2 answer



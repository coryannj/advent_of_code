const fs = require('fs');
const input = fs.readFileSync('../day8input.txt',{ encoding: 'utf8', flag: 'r' });

//Part 1
const instructions = input.match(/\w{300,}/g).join('')
const maps = input.substring(309)

let next = 'AAA'
let steps = 0

while (next !== 'ZZZ') {
  for (letter of instructions) {
    let index = maps.indexOf(next+' =')
    letter === 'L' ? next=maps.substring(index+7,index+10):next=maps.substring(index+12,index+15)
    steps++
  }
}

console.log(steps) // Part 1 answer

//Part 2
let nextpart2 = maps.match(/\w{2}A(?= [=])/g) // [ 'BXA', 'KBA', 'VTA', 'AAA', 'HMA', 'HLA' ]
let stepsarray=[]

function getSteps(node) {
  let thisnode = node
  let steps = 0
  while (thisnode.substring(2) !== 'Z') {
    for (letter of instructions) {
      let index = maps.indexOf(thisnode+' =')
      letter === 'L' ? thisnode=maps.substring(index+7,index+10):thisnode=maps.substring(index+12,index+15)
      steps++
    }
  }
  return steps
}

for (startval of nextpart2) {
  stepsarray.push((getSteps(startval)))
}
console.log(stepsarray) // Take values and manually get lowest common multiplier


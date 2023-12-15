const fs = require('fs');
const input = fs.readFileSync('../day15input.txt',{ encoding: 'utf8', flag: 'r' });

endlineRegex= /[\r\n]+/g

const steps = input.replaceAll(endlineRegex,'').split(',')

//Part 1

let stepcounter=0

for (step of steps) {
  
  let stepvalue=0

  for (char of step) {
    currvalue = ((char.charCodeAt(0)+stepvalue)*17)%256
    stepvalue = currvalue
  }
  stepcounter=stepcounter+stepvalue

}
console.log(stepcounter) // Part 1 answer


//Part 2

let boxes = {}

// Gets hash algo value for string
function hash(string) {
  let stepvalue=0
  for (char of string) {
    currvalue = ((char.charCodeAt(0)+stepvalue)*17)%256
    stepvalue = currvalue
  }
  return stepvalue.toString()
}

for (step of steps) {

  // Remove value - Symbol is '-'
  if (step.includes('-')) {

    let label = step.split('-')[0]
    let box = hash(label)

    // Checks if hash val and label is present, then removes if found
    if (boxes.hasOwnProperty(box) === true && boxes[box].findIndex((x)=> x[0]===label) !== -1) {
      boxes[box]=boxes[box].filter((x)=> x[0] != label)
    }

  } else {
      //Symbol is '='
      let label = step.split('=')[0]
      let lens = step.split('=')[1]
      let box = hash(label)

      // Checks if Box value is already present in object keys
      if (boxes.hasOwnProperty(box) === true) {

        // Checks if label if present for box value - if yes update lens only
        if (boxes[box].findIndex((x)=> x[0]===label) !== -1) {
          let thisindex = boxes[box].findIndex((x)=> x[0] === label)
          boxes[box][thisindex][1] = lens
        } else {
          // If label not found - add label and lens
          boxes[box].push([label,lens])
        }
      } else {
        // If Box value not found - create new key for Box value and add label/lens
        boxes[box] = ([[label,lens]])
      }

    }
}

// Get list of hash values
let boxnumbers = Object.keys(boxes)

let focuspower=0

for (box of boxnumbers) {
  if (boxes[box].length > 0) {
    // Get array of arrays of label/lens pairs
    let lenses = boxes[box]
    for ([ind,val] of lenses.entries()) {
      let toAdd = (parseInt(box)+1)*(ind+1)*val[1]
      focuspower = focuspower+toAdd
    }
  }
}

console.log(focuspower)






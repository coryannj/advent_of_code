const fs = require('fs');
const inputload = fs.readFileSync('../day2input.txt',{ encoding: 'utf8', flag: 'r' });
const input = inputload.split(/[\r\n]+/)

//Part 1

//Regexes for game number and invalid games (e.g. >12 red,>13 green,>14 blue)
let gameregex = /\d+(?=:)/g
let rulesregex= /(1[3-9] red|[2-9][0-9] red|\d{3,} red|1[4-9] red|1[4-9] green|[2-9][0-9] green|\d{3,} green|1[5-9] blue|[2-9][0-9] blue|\d{3,} blue)/m

//Map checks for rules breach, passes 0 if found or game number if not, then sums array
let gamessum = input
.map((x) => {
    let notpossible = x.match(rulesregex)
    return notpossible === null ? parseInt(x.match(gameregex)[0]) : 0
}).reduce((acc,curr) => acc + curr,0)
console.log(gamessum)

// Part 2

// Regex to get values for each colour
const regexred = /\d+(?= red)/g
const regexgreen = /\d+(?= green)/g
const regexblue = /\d+(?= blue)/g

// Function to get Max value in array of numbers
function maxOfArray(array) {
     return Math.max.apply(Math, array);
   }

// Map uses regex to get array of values for each colour, finds maximum for each and multiplies to get the power, then sums array
let gamespowersum = input
.map((x) => {
    let maxred = maxOfArray(x.match(regexred).map((x) => parseInt(x)))
    let maxgreen = maxOfArray(x.match(regexgreen).map((x) => parseInt(x)))
    let maxblue = maxOfArray(x.match(regexblue).map((x) => parseInt(x)))
    return maxred*maxgreen*maxblue
}).reduce((acc,curr) => acc + curr,0)
console.log(gamespowersum)

const fs = require('fs');
const input = fs.readFileSync('../day4input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/)


// Part 1

// Regexes
const splitregex = /[\w\s]+(?=[\|]|$)/gm // gets winning numbers and your numbers
const numregex = /\d+/gm

// Lookup array for points - padded with zero
let result = [0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576,2097152,4194304,8388608]

let totalpoints=0

for(line of lines) {
  // Gets array of winning numbers
  let winningnums = line.match(splitregex)[0].match(numregex)
  let ournums = line.match(splitregex)[1].match(numregex)
  let ourwinning = ournums.filter((x) => winningnums.includes(x))
  ourwinning.length >0 ? totalpoints=totalpoints+result[ourwinning.length]:''
}

// Part 1 result
console.log(totalpoints) 

// Part 2

// Array for storing number of each scratchcard, all vals start with 1
let scratchcards = Array(193).fill(1)

for ([index,val] of lines.entries()) {
    // Gets array of winning numbers
    let game = val.match(splitregex)[0].match(numregex)
    let mynums = val.match(splitregex)[1].match(numregex)
    let winning = mynums.filter(item=> game.includes(item))
    let j = winning.length+1

    // Adds number of current scratchcards to subsequent scratchcard vals
    for (let i=1;i<j;i++) {
        scratchcards[index+i] = scratchcards[index+i] + scratchcards[index]
    }
}

// Part 2 result
console.log(scratchcards.reduce((acc,curr) => acc + curr,0))


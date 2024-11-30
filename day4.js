const fs = require('fs');
const input = fs.readFileSync('../day4input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.replaceAll('Card ','').split(/[\r\n]+/).map((x)=>x.split(/[:|]/).map((y)=>y.trim().split(/[\s]+/)))

// Part 1
const result = Array(25).fill(2).map((x,ix)=>Math.pow(x,ix))

let winning = lines.map(([x,y,z])=>{
  let myNumbers = new Set(y)
  let winningNumbers = new Set(z)
  return myNumbers.intersection(winningNumbers).size
})

console.log(winning.map((x)=> result[x-1] || 0).reduce((acc,curr)=>acc+curr))

// Part 2

let scratchcards = Object.fromEntries(winning.map((x,ix)=>[ix,1]))

winning.forEach((score,index)=>{
  for(i=1;i<=score;i++){
    scratchcards[index+i]+=scratchcards[index]
  }
})

console.log(Object.values(scratchcards).reduce((a,c)=>a+c))

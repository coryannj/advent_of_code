const fs = require('fs');
const input = fs.readFileSync('../day9input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map(Number)

let noSum = lines.find((x,ix,xarr)=> {
    if(ix<25){
        return false
    } else {
        let preamble = lines.slice(ix-25,ix)
        return preamble.findIndex((y,yx,arr)=> arr.includes(x-y)) === -1
    }
})

console.log(noSum) // Part 1 answer

let noSumInd = lines.findIndex((x)=> x===noSum)

let findSum = -1
let size = 1

while(findSum === -1){
    findSum = lines.findIndex((x,ix,arr)=> ix !== noSumInd && arr.slice(ix,ix+size).reduce((acc,curr)=>acc+curr,0)===noSum)
    size++
}

let slice = lines.slice(findSum,findSum+size).sort((a,b)=>a-b)
console.log(slice[0]+slice.at(-1)) // Part 2 answer
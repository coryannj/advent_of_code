const fs = require('fs');
const input = fs.readFileSync('../day6input.txt',{ encoding: 'utf8', flag: 'r' });
const numRegex = new RegExp(/\d+/, 'g');

let lines = input.split(',').map(Number)
//console.log(lines)

let p1Fish = lines.slice()
let p1Time = 80

while(p1Time>0){
    let newFishIndex = p1Fish.filter((x)=> x === 0).length
    let newTimer = p1Fish.map((x)=> x===0 ? 6 : x-1)
    
    let newFish = Array(newFishIndex).fill(8)
    p1Fish = newTimer.concat(newFish)
    p1Time--

}

console.log(p1Fish.length)

let p2Fish = {0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0}

lines.slice().forEach((fish)=>{
    p2Fish[fish]++
})
console.log(p2Fish)

let p2Time = 256

while(p2Time>0){
    let newFishObj = {
        0:p2Fish[1],
        1:p2Fish[2],
        2:p2Fish[3],
        3:p2Fish[4],
        4:p2Fish[5],
        5:p2Fish[6],
        6:p2Fish[7]+p2Fish[0],
        7:p2Fish[8],
        8:p2Fish[0]
    }
    p2Fish = newFishObj

    p2Time--

}

console.log(Object.values(p2Fish).reduce((acc,curr)=>acc+curr))
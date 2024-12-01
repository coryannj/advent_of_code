const fs = require('fs');
const input = fs.readFileSync('../day6input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\s+/).map(Number)
let len = lines.length

// Part 1
let p1seen = []
let p1lines = lines.slice()
let p1counter = 0

while(!p1seen.includes(p1lines.join('|'))){
    
    p1seen.push(p1lines.join('|'))
    
    let maxIndex = p1lines.findIndex((x,ix,arr)=>arr.findIndex((y,yx)=>yx!==ix && y>x)===-1)

    let distribute,remainder
    
    if(p1lines[maxIndex]%(len+1) === 0){
        distribute = p1lines[maxIndex]/len
        remainder = distribute
    } else {
        distribute = Math.floor(p1lines[maxIndex]/len)
        remainder = p1lines[maxIndex]-(distribute*(len-1))
    }

    if(distribute>0){
        p1lines = p1lines.map((x,ix)=> ix !== maxIndex ? x+=distribute:remainder)
    } else {
        let val = p1lines[maxIndex]
        let updateInd = (maxIndex+1)%(len)

        while(val>0){
            p1lines[updateInd]++
            updateInd = (updateInd+1)%(len)
            val--
        }
        p1lines[maxIndex] = 0
    }
    
    p1counter++

}
console.log(p1counter)

// Part 2
let loopState = p1lines.join('|')
let p2seen = []
let p2counter = 0

while(!p2seen.includes(loopState)){
    
    let maxIndex = p1lines.findIndex((x,ix,arr)=>arr.findIndex((y,yx)=>yx!==ix && y>x)===-1)

    let distribute,remainder
    
    if(p1lines[maxIndex]%(len+1) === 0){
        distribute = p1lines[maxIndex]/len
        remainder = distribute
    } else {
        distribute = Math.floor(p1lines[maxIndex]/len)
        remainder = p1lines[maxIndex]-(distribute*(len-1))
    }

    if(distribute>0){
        p1lines = p1lines.map((x,ix)=> ix !== maxIndex ? x+=distribute:remainder)
    } else {
        let val = p1lines[maxIndex]
        let updateInd = (maxIndex+1)%(len)

        while(val>0){
            p1lines[updateInd]++
            updateInd = (updateInd+1)%(len)
            val--
        }
        p1lines[maxIndex] = 0

    }
    p2seen.push(p1lines.join('|'))

    p2counter++

}

console.log(p2counter)
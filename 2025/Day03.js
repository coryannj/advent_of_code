const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day3.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/[\r\n]/).map((x)=>x.split('').map(Number));

const maxJoltage = (batteries,len) =>{
    if(batteries.length === len) return batteries.join('');
    if(len === 1) return Math.max(...batteries);

    let result = '';
    let slice = batteries.slice(0,-(len-1));
    let max = Math.max(...slice);
    let maxInd = slice.indexOf(max);
    result+=max;

    if(result.length<len){
        result+=maxJoltage(batteries.slice(maxInd+1),len-1);
    }

    return result
}

const sumJoltage = (arr,len) => {
    let aLen = arr.length-1;
    let total = 0;

    for(i=aLen;i>=0;i--){
        total+= +maxJoltage(arr[i],len);
    }

    return total
}

console.log('Part 1 answer is ', sumJoltage(lines,2)) // Part 1
console.log('Part 2 answer is ', sumJoltage(lines,12)) // Part 2

// Iterative version for p2 I did during contest
let output=0
let lineLen=lines[0].length

lines.forEach((x)=>{
    let result = []
    let remaining = 12
    let currInd = 0

    for(i=-11;i<=0;i++){
        let thisSlice = i<0 ? x.slice(currInd).slice(0,i) : x.slice(currInd)

        let max = Math.max(...thisSlice)
        let maxInd = thisSlice.indexOf(max)
        
        result.push(max)
        remaining--
        currInd+=maxInd+1

        if(remaining>0 && (lineLen-currInd) === remaining){
            result.push(...x.slice(currInd))
            break;
        }

    }

    output+= +result.join('')
})

console.log(output)

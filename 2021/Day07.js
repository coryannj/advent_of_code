const fs = require('fs');
const input = fs.readFileSync('../day7input.txt',{ encoding: 'utf8', flag: 'r' });
const numRegex = new RegExp(/\d+/, 'g');

let lines = input.split(',').map(Number)
console.log(lines)

let fuel = lines.map((x,ix,arr)=>{
    let distTo = arr.filter((y,yix)=>yix!==ix).map((z)=> Math.abs(z-x)).reduce((acc,curr)=>acc+curr)
    return distTo
})

console.log(Math.min(...fuel)) // Part 1 answer

let min = Math.min(...lines)
let max = Math.max(...lines)
let maxSteps = max-min+1

let fuelObj = {0:0}

for(j=1;j<=maxSteps;j++){
    if(j===1){
        fuelObj[j] = j
    } else {
        fuelObj[j] = j+fuelObj[j-1]
    }
}

let p2Fuel = lines.map((x,ix,arr)=>{
    let distTo = arr.filter((y,yix)=>yix!==ix).map((z)=> fuelObj[`${Math.abs(z-x)}`]).reduce((acc,curr)=>acc+curr)
    return distTo
})

console.log(Math.min(...p2Fuel)) // Part 2 answer

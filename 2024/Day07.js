const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day7.txt', {encoding: "utf8", flag: "r", });

// During contest I solved this via brute force by calculating cartestian product of all operators for arr.length-1, which took 830.676 seconds to run :-D 

// For rewrite took help from https://github.com/Withered-Flower-0422/AoC-2024-js/blob/main/day07/part1.js (just couldn't get my head around how to return the array in recursion)

const p1findTotal = (total,arr) => {
    if (arr.length === 1) return arr[0] === total
    if (arr.sum() === total || arr.multiply() === total) return true

    let rest = arr.slice(2)
    let add = [arr[0]+arr[1], ...rest]
    let multiply = [arr[0]*arr[1], ...rest]
    
    return p1findTotal(total,add) || p1findTotal(total,multiply)
    
}

const p2findTotal = (total,arr) => {
    if (arr.length === 1) return arr[0] === total
    //if (arr.sum() === total || arr.multiply() === total || +(arr.join(''))===total) return true // works way slower with this

    let rest = arr.slice(2)
    let add = [arr[0]+arr[1], ...rest]
    let multiply = [arr[0]*arr[1], ...rest]
    let concat = [Number(`${arr[0]}${arr[1]}`), ...rest]
    
    return p2findTotal(total, add) || p2findTotal(total, multiply) || p2findTotal(total, concat)
}

let arr1 = input.lines().map((x)=>x.split(/[\s:]+/).map(Number))
let arrLen = arr1.length
let p1result = 0
let p2result = 0

for(i=0;i<arrLen;i++){
    let [key, ...vals] = arr1[i]

    if(!vals.includes(1) && key > vals.multiply()){
        p2result += key === +vals.join('') || p2findTotal(key,vals) ? key : 0
        continue;
    } else {
        if(p1findTotal(key,vals)){
            p1result += key
        } else {
            p2result += key === +vals.join('') || p2findTotal(key,vals) ? key : 0
        }
    }
}

console.log('P1 result is ',p1result,' P2 result is ',p1result+p2result)
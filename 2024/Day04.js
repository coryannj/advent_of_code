const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../../day4.txt', {encoding: "utf8", flag: "r", });

// Part 1

// Extend grid to avoid bounds checking
let arr = input.lines().map((x)=>'___'+x+'___')
let collen = arr[0].length
arr.unshift(...Array(3).fill(0).map((x)=>"_".repeat(collen)))
arr.push(...Array(3).fill(0).map((x)=>"_".repeat(collen)))
arr = arr.mk2d()

const xmas = ([r,c]) => {
    let ans = 'XMAS'
    let result = 0
    for(i=-1;i<=1;i++){
        for(j=-1;j<=1;j++){

            if(i === 0 && j === 0) continue;
            
            let subResult = 0;
            
            for(k=1;k<=3;k++){
                if(arr[r+(i*k)][c+(j*k)] !== ans[k]) break;
                subResult++;
            }
            
            if(subResult===3) result++
        }
    }
    return result
}

let p1queue = arr.flatMap((x,xi)=> x.flatMap((y,yi)=>y==='X' ? [[xi,yi]] : []))
let p1Len = p1queue.length
let p1result = 0

for(e=0;e<p1Len;e++){
    p1result+=xmas(p1queue[e])
}

console.log(p1result)

// Part 2 lololololol wish I'd remembered this while solving
console.log(input.match(/(?=(M|S).(M|S).{139}A.{139}(?!\2)(M|S).(?!\1)(M|S))/gsd).length) 
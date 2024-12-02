const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../../day2.txt', {encoding: "utf8", flag: "r", });

let arr = input.lines().mk2d('\\s+',1)

const isSafe = (a) => {d = a.slice(0,-1).map((v,i)=> v-a[i+1]); return d.every((e)=> e > 0 && e < 4) || d.every((e)=> e < 0 && e > -4)}

let safe = arr.flatMap((x,ix)=> isSafe(x) ? [ix]:[])

console.log(safe.length) // Part 1 answer

console.log(arr.filter((x,ix)=>!safe.includes(ix) && x.some((y,yx)=> isSafe(x.toSpliced(yx,1)))).length + safe.length) // Part 2 answer

// Version with for loop for fun
let p1safe = 0;
let p2safe = 0;

for (i=0;i<arr.length;i++){
    let x = arr[i];

    if(isSafe(x)){
        p1safe++
    } else if (x.some((y,yx)=> isSafe(x.toSpliced(yx,1)))) {
        p2safe++
    }
}

console.log('Part 1 answer is ',p1safe,' Part 2 answer is ',p1safe+p2safe)
const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('./inputs/2024/day4.txt', {encoding: "utf8", flag: "r", });

// Part 1 - loop version
let arr = input.lines().mk2d()
let p1queue = arr.flatMap((x,xi)=> x.flatMap((y,yi)=>y==='X' ? [[xi,yi]] : []))
let p1Len = p1queue.length
let p1result = 0
let ans = 'XMAS'

for(h = 0; h < p1Len; h++){
    let [r,c] = p1queue[h]
    for(i = -1; i <= 1; i++){
        for(j = -1; j <= 1; j++){
            if(i === 0 && j === 0) continue;
            
            let subResult = 0;
            
            for(k=1;k<=3;k++){
                if(arr[r+(i*k)]?.[c+(j*k)] !== ans[k]) break;
                subResult++;
            }
            
            if(subResult===3) p1result++
        }
    }
}

console.log(p1result)

// Part 1 regex version
console.log(input.match(/(?=XMAS|SAMX)/g).length+input.match(/(?=X.{140}M.{140}A.{140}S|S.{140}A.{140}M.{140}X)/gs).length+input.match(/(?=X.{139}M.{139}A.{139}S|S.{139}A.{139}M.{139}X)/gs).length+input.match(/(?=X.{141}M.{141}A.{141}S|S.{141}A.{141}M.{141}X)/gs).length)

// Part 2 lololololol wish I'd remembered this while solving
console.log(input.match(/(?=(M|S).(M|S).{139}A.{139}(?!\2)(M|S).(?!\1)(M|S))/gs).length) 
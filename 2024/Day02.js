const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../../day2.txt', {encoding: "utf8", flag: "r", });

let arr = input.lines().mk2d('\\s+',1)

const isSafe = (a) => (a.join('') === a.sorta().join('')|| a.join('') === a.sortd().join('')) && (a.every((y,yx,yarr)=> yx ===yarr.length-1 || (Math.abs(y-yarr[yx+1])>=1 && Math.abs(y-yarr[yx+1])<=3)))

let safe = arr.flatMap((x,ix)=> isSafe(x) ? [ix]:[])

console.log(safe.length) // Part 1 answer

console.log(arr.filter((x,ix)=>!safe.includes(ix)).filter((x)=>x.some((y,yx,yarr)=> isSafe(yarr.filter((z,zx)=> zx !== yx)))).length + safe.length) // Part 2 answer
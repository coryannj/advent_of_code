const { match } = require("assert");
const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day25.txt', {encoding: "utf8", flag: "r", });

const lines = input.lines(2).map((x)=>x.lines().mk2d())

let locks = lines.filter((x)=>x[0].every((y)=>y==='#')).map((x,ix)=>x[0].map((y,yx,yarr)=>x.col(yx).filter((z)=>z==='.').length))
let keys = lines.filter((x)=>x[6].every((y)=>y==='#')).map((x,ix)=>x[0].map((y,yx,yarr)=>x.col(yx).filter((z)=>z==='#').length))

let p1 = 0

locks.forEach((x)=>{
    keys.forEach((y)=>{
        if(y.every((z,zx)=>z<=x[zx])){
            p1++
        }
    })
})

console.log('Part 1 answer is ',p1)
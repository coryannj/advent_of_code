const fs = require("fs");
require("../utils.js");
const { shoelace, md5, gcd, lcm, nextArr, nextArr8 } = require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day13.txt', {encoding: "utf8", flag: "r", });

let config = input.lines(2).map((x)=>x.match(/\d+/gs).map(Number))

let p1 = 0
let p2 = 0
let offset = 10000000000000

const claw = ([ax,ay,bx,by,tx,ty], partNo) => {   
    if(partNo === 2) tx+=offset,ty+=offset

    pressA = ((tx*by)-(ty*bx))/((ax*by)-(ay*bx))
    pressB = (ty-(pressA*ay))/by

    if(pressA === Math.floor(pressA) && pressB === Math.floor(pressB)){
        partNo === 1 ? p1+=((3*pressA)+pressB) : p2+=((3*pressA)+pressB)
    }
}

config.forEach((c)=>{
    claw(c,1)
    claw(c,2)
})

console.log(p1,p2)
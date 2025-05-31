const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day10.txt', {encoding: "utf8", flag: "r", });

let lines = input.lines()

let robotStart = lines.filter((x)=>x.includes('value')).map((x)=>x.match(/\d+/g).map(Number))

let robots = new Map()

robotStart.forEach(([val,bot])=>{
  robots.set(val,bot)
})

let instructions = lines.filter((x)=>x.includes('gives')).map((x)=>x.match(/(\d+|bot|output)/g).map((x,ix)=>ix%2 === 1 ? Number(x):x))

let botQueue = [...robots.values()].filter((x,ix,arr)=>ix!==arr.lastIndexOf(x))

let output = new Map()
let p1

while(botQueue.length>0){
  let next = botQueue.shift()
  let [lo,hi] = [...robots.keys()].filter((x)=>robots.get(x)===next).sorta()

  if(lo === 17 && hi === 61){
    p1 = next
  }
  let instruction =instructions.find((b)=>b[1]===next)

  if(instruction!==undefined){
    if(instruction[2]==='bot'){
      robots.set(lo,instruction[3])
    } else {
      robots.set(lo,`output${instruction[3]}`)
      output.set(instruction[3],lo)
    }

    if(instruction[4]==='bot'){
      robots.set(hi,instruction[5])
    } else {
      robots.set(hi,robots.set(hi,instruction[5]))
      output.set(instruction[3],hi)
    }
    
    
  }
  botQueue = [...robots.values()].filter((x,ix,arr)=>ix!==arr.lastIndexOf(x))

}

console.log('p1 answer is ',p1)
console.log('p2 answer is ',[...output.entries()].filter(([k,v])=>0<=k && k<=2).map((x)=>x[1]).multiply())
const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day24input.txt',{ encoding: 'utf8', flag: 'r' });

// No chance of solving this on my own - solution from HyperNeutrino: https://www.youtube.com/watch?v=guOyA7Ijqgk

const numRegex = /([-]{0,1}\d+)/g

let lines = input.split(/[\r\n]+/).map((x,idx)=> {
  let coOrd = x.match(numRegex).map(Number)
  //console.log(coOrd)
  let a = coOrd[4]
  let b = -coOrd[3]
  let c = (coOrd[4]*coOrd[0]) - (coOrd[3]*coOrd[1])
  return coOrd.concat(a,b,c)
})



// Part 1

let testAreaMin = 200000000000000
let testAreaMax = 400000000000000

let queue = JSON.parse(JSON.stringify(lines))

let intersecting = 0

while (queue.length>0){
  let [x1,y1,z1,vx1,vy1,vz1,a1,b1,c1]= queue.shift()
  for(i=0;i<queue.length;i++) {
    let [x2,y2,z2,vx2,vy2,vz2,a2,b2,c2] = queue[i]
    let denominator = (a1*b2) - (a2*b1)

    if (denominator !== 0) {
      let x = ((c1*b2) - (c2*b1)) / denominator
      let y = ((c2*a1) - (c1*a2)) / denominator
      if (x >= testAreaMin && x <= testAreaMax && y>=testAreaMin && y <= testAreaMax){
        if(((x-x1) * vx1) >= 0 && ((y-y1) * vy1) >=0 && ((x-x2) * vx2) >= 0 && ((y-y2) * vy2) >=0) {
          intersecting++
        }
      }
    }

  }
  
}
console.log(intersecting) // Part 1 answer


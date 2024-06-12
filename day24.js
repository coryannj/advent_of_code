const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day24input.txt',{ encoding: 'utf8', flag: 'r' });

const numRegex = /([-]{0,1}\d+)/g

let lines = input.split(/[\r\n]+/).map((x,idx)=> {
  let coOrd = x.match(numRegex).map(Number)
  let a = coOrd[4] // vy
  let b = -coOrd[3] // -vx
  let c = (coOrd[4]*coOrd[0]) - (coOrd[3]*coOrd[1]) // (vy*sx)-(vx*sy)
  return coOrd.concat(a,b,c)
})

// Part 1
// No chance of solving this on my own - solution from HyperNeutrino: https://www.youtube.com/watch?v=guOyA7Ijqgk

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


// Part 2

// This is a straight copy from https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/kicuapd/ -> https://pastebin.com/pnbxaCVu 
// Just could not get my head around the maths...

// Getting 3 vectors with shared vy velocity
let vySort = lines.flatMap((x)=>x[4]).sort((a,b)=> a-b);
let vyMap = new Map();

lines.forEach(([x1,y1,z1,vx1,vy1,vz1,a1,b1,c1])=>{
  if (vyMap.has(vy1)){
    vyMap.get(vy1).push([x1,y1,z1,vx1,vy1,vz1,a1,b1,c1])
  } else {
    vyMap.set(vy1,[])
    vyMap.get(vy1).push([x1,y1,z1,vx1,vy1,vz1,a1,b1,c1])
  }
});

let mostVY = [...vyMap.keys()].filter((x)=> vyMap.get(x).length>1).sort((a,b)=> vyMap.get(b).length-vyMap.get(a).length).at(0);
let checky = vyMap.get(mostVY).sort((a,b)=>b[3]-a[3]).slice(0,3);

// Plot out co-ords

let [x0,y0,z0,vx0,vy0,vz0,a0,b0,c0] = checky[0]
let [x1,y1,z1,vx1,vy1,vz1,a1,b1,c1] = checky[1]
let [x2,y2,z2,vx2,vy2,vz2,a2,b2,c2] = checky[2]

//calculate relative velocities of hail 1 and 2 to hail 0
//the y component is zero due to selection of hail
vxr1 = vx1 - vx0
vzr1 = vz1 - vz0
vxr2 = vx2 - vx0
vzr2 = vz2 - vz0

//relative initial position of hail 1
xr1 = x1 - x0
yr1 = y1 - y0
zr1 = z1 - z0
 
//relative initial position of hail 2
xr2 = x2 - x0
yr2 = y2 - y0
zr2 = z2 - z0

//Solve set of two linear equations x=x and z=z
let num2 = (yr2*xr1*vzr1)-(vxr1*yr2*zr1)+(yr1*zr2*vxr1)-(yr1*xr2*vzr1)
let den2 = yr1*((vzr1*vxr2)-(vxr1*vzr2))
t2 = num2 / den2
 
//Substitute t2 into a t1 equation
let num1 = (yr1*xr2)+(yr1*vxr2*t2)-(yr2*xr1)
let den1 = yr2*vxr1
t1 = num1 / den1
console.log('t1 time of first vector @ collision', t1)
console.log('t2 time of second vector @ collision', t2)

//calculate collision position at t1 and t2 of hail 1 and 2 in normal frame of reference
cx1 = x1 + (t1*vx1)
cy1 = y1 + (t1*vy1)
cz1 = z1 + (t1*vz1)
 
cx2 = x2 + (t2*vx2)
cy2 = y2 + (t2*vy2)
cz2 = z2 + (t2*vz2)
console.log('collision one occurs @', cx1, cy1, cz1)
console.log('collision two occurs @', cx2, cy2, cz2)
 
//calculate the vector the rock travelled between those two collisions
xm = (cx2-cx1)/(t2-t1)
ym = (cy2-cy1)/(t2-t1)
zm = (cz2-cz1)/(t2-t1)
console.log('rock vector', xm, ym, zm)
 
//calculate the initial position of the rock based on its vector
xc = cx1 - (xm*t1)
yc = cy1 - (ym*t1)
zc = cz1 - (zm*t1)
console.log('rock inital position', xc, yc, zc)
console.log('answer',Math.round(xc+yc+zc))
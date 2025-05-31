const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../inputs/2023/day24.txt', {encoding: "utf8", flag: "r", });

const numRegex = /([-]{0,1}\d+)/g

let lines = input.split(/[\r\n]+/).map((x,idx)=> {
  let coOrd = [sx,sy,sz,vx,vy,vz] = x.match(numRegex).map(Number)
  let a = vy // vy
  let b = -vx // -vx
  let c = (vy*sx) - (vx*sy) // (vy*sx)-(vx*sy)
  return coOrd.concat(a,b,c)
})

//xz
// let lines = input.split(/[\r\n]+/).map((x,idx)=> {
//   let coOrd = [sx,sy,sz,vx,vy,vz] = x.match(numRegex).map(Number)
//   let a = vz // vz
//   let b = -vx // -vx
//   let c = (vz*sx) - (vx*sz) // (vz*sx)-(vx*sz)
//   return coOrd.concat(a,b,c)
// })

//yz
// let lines = input.split(/[\r\n]+/).map((x,idx)=> {
//   let coOrd = [sx,sy,sz,vx,vy,vz] = x.match(numRegex).map(Number)
//   let a = vz // vz
//   let b = -vy // -vy
//   let c = (vz*sy) - (vy*sz) // (vz*sy)-(vy*sz)
//   return coOrd.concat(a,b,c)
// })

// let a = [340439912405459, 372883800332263,	373701949310610, 346244240547537]
// console.log(Math.sqrt(Math.pow(a[0]-a[2],2)+Math.pow(a[1]-a[3],2)))
// console.log((a[0]+a[2])/2,(a[1]+a[3])/2)

// let b = [367896753444609,	369465024011541,346245108271460,	349663016868258]
// console.log(Math.sqrt(Math.pow(b[0]-b[2],2)+Math.pow(b[1]-b[3],2)))
// console.log((b[0]+b[2])/2,(b[1]+b[3])/2)

// let c = [371546178656678,	354867323163265,342595683059391,	364260717716535]
// console.log(Math.sqrt(Math.pow(c[0]-c[2],2)+Math.pow(c[1]-c[3],2)))
// console.log((c[0]+c[2])/2,(c[1]+c[3])/2)
// //371546178656678	354867323163265	295342648000210	342595683059391	364260717716535	342962029925265
// // 360.57, 355.651

// function minDist (x1,y1,vx1,vy1,x2,y2,vx2,vy2) {
//   x1 = BigInt(x1)
//   y1 = BigInt(y1)
//   vx1 = BigInt(vx1)
//   vy1 = BigInt(vy1)
//   x2 = BigInt(x2)
//   y2 = BigInt(y2)
//   vx2 = BigInt(vx2)
//   vy2 = BigInt(vy2)

//   let xDist = x1>x2 ?x1-x2:x2-x1
//   let xt = vx1-vx2
//   let yDist = y1>y2?y1-y2:y2-y1
//   let yt = vy1-vy2
//   console.log(xDist,xt,yDist,yt)
//   let constant = (xDist*xDist)+(yDist*yDist)
//   let xtsquare = 2n*xDist*xt
//   let ytsquare = 2n*yDist*yt

//   // if(xtsquare<0){
//   //   xtsquare = -1n*xtsquare
//   // }

//   // if(ytsquare<0){
//   //   ytsquare = -1n*ytsquare
//   // }

//   let xt2 = 2n*(xt*xt)
//   let yt2 = 2n*(yt*yt)
//   console.log('constant',constant,'xtsquare,ytsq',xtsquare,ytsquare,'xt,xt2',xt,xt2,'yt,yt2',yt,yt2)

//   let addsquares = xtsquare+ytsquare

//   if(addsquares<0){
//     addsquares = -1n*addsquares
//   }

//   console.log('xt2+yt2',xt2+yt2,'addsquares',addsquares)
//   console.log(addsquares/(xt2+yt2))
//   return addsquares/(xt2+yt2)

// }
// console.log('p1',minDist(370372004337519,359564020439900,-7,28,343769857378550,359564020439900,7,-28)) // past midpoint

// console.log(307967236276n+111773726718n)


// // console.log('p1',minDist(373701949310610,346244240547537,-7,28,340439912405459,372883800332263,7,-28)) // og points
// console.log('e1',minDist(373,346,-7,28,340,373,7,-28))
// //console.log('e2',minDist(5,6,3,2,3,0,2,4))


// // start (340,373) end (357.070,359.564)

// let [startx,starty,endx,endy] = [340,373,357.070,359.564]

// console.log(endx+Math.abs(starty-endy),endy+Math.abs(endx-startx))
// console.log(endx-Math.abs(starty-endy),endy-Math.abs(endx-startx))
// console.log(startx+Math.abs(endy-starty),starty+Math.abs(startx-endx))


// console.log(lines)

// lines.map(([x1,y1,z1,vx1,vy1,vz1,a1,b1,c1])=>[vx1,vy1,vz1]).forEach(([vx1,vy1,vz1],ix,arr)=>{
//   let rest = arr.filter((z,zx)=>zx !== ix)

//   rest.forEach(([vx2,vy2,vz2])=>{
//     if((vx1%vx2===0||vx2%vx1===0)&&(vy1%vy2===0||vy2%vy1===0)&&(vz1%vz2===0||vz2%vz1===0)){
//       console.log([vx1,vy1,vz1],[vx2,vy2,vz2])
//     }

//     if(vx1%vx2===0 && vy1%vy2 === 0){
//       if(vx1/vx2===vy1/vy2){
//         console.log('vx1 vy1',[vx1,vy1,vz1],[vx2,vy2,vz2],[vx1/vx2,vy1/vy2])
//       }

      
//     }

//     if(vx2%vx1===0 && vy2%vy1 === 0){
//       if(vx2/vx1===vy2/vy1){
//         console.log('vx2 vy2',[vx1,vy1,vz1],[vx2,vy2,vz2],[vx2/vx1,vy2/vy1])
//       }
      
//     }

//     if(vx1%vx2===0 && vz1%vz2 === 0){
//       if(vx1/vx2===vz1/vz2){
//         console.log('vx1 vz1',[vx1,vy1,vz1],[vx2,vy2,vz2],[vx1/vx2,vz1/vz2])
//       }
      
//     }

//     if(vx2%vx1===0 && vz2%vz1 === 0){
//       if(vx2/vx1===vz2/vz1){
//         console.log('vx2 vz2',[vx1,vy1,vz1],[vx2,vy2,vz2],[vx2/vx1,vz2/vz1])
//       }
      
//     }
//     if(vy1%vy2===0 && vz1%vz2 === 0){
//       if(vy1/vy2===vz1/vz2){
//         console.log('vy1 vz1',[vx1,vy1,vz1],[vx2,vy2,vz2],[vy1/vy2,vz1/vz2])
//       }
      
//     }

//     if(vy2%vy1===0 && vz2%vz1 === 0){
//       if(vy2/vy1===vz2/vz1){
//         console.log('vy2 ∂vz2',[vx1,vy1,vz1],[vx2,vy2,vz2],[vy2/vy1,vz2/vz1])
//       }
      
//     }

//   })
// })

// Part 1
// No chance of solving this on my own - solution from HyperNeutrino: https://www.youtube.com/watch?v=guOyA7Ijqgk
let testAreaMin = -200000000000000
let testAreaMax = 400000000000000
//let testAreaMin = 200000000000000
//let testAreaMax = 400000000000000
//200000000000000
//187016878804004.03 175507140888229.06 177831791810924.03

let queue = JSON.parse(JSON.stringify(lines))

//let queue = lines[0].slice()
let restMax = 0
let restVector

lines.forEach(([x1,y1,z1,vx1,vy1,vz1,a1,b1,c1],ix,arr)=>{
  console.log('NEW LINE vector is ',[x1,y1,z1,vx1,vy1,vz1])
  let rest = arr.filter((y,yx)=>yx!==ix).filter(([x2,y2,z2,vx2,vy2,vz2,a2,b2,c2])=>{
    let denominator = (a1*b2) - (a2*b1)
    if(denominator === 0){
      return false
    } else {
      let x = ((c1*b2) - (c2*b1)) / denominator
      let y = ((c2*a1) - (c1*a2)) / denominator

      let t = (y-y1)/vy1
      //console.log([x2,y2,z2,vx2,vy2,vz2],x,y,t)
      // if(x1===187016878804004){
      //   //let t = (x-x1)/vx1
      //   let z = z2+(t*vz2)
      //   console.log(x2,y2,z2,vx2,vy2,vz2,x,y,z,t)
      // }
      if(((x-x1) * vx1) >= 0 && ((y-y1) * vy1) >=0 && ((x-x2) * vx2) >= 0 && ((y-y2) * vy2) >=0) { 
        return true
      } else {
        return false
      }
      //console.log([x2,y2,z2,vx2,vy2,vz2],y,z,t)
      //return true
    }
  })


  //console.log('vector is ',[x1,y1,z1,vx1,vy1,vz1],'rest length is ',rest.length)
  if(rest.length>restMax){
    restMax=rest.length
    restVector = [x1,y1,z1,vx1,vy1,vz1,a1,b1,c1]
  }


})

console.log('rest max is ',restMax,restVector)

let intersecting = 0
let xyobj = {}
while (queue.length>0){
  let [x1,y1,z1,vx1,vy1,vz1,a1,b1,c1]= queue.shift()
  //console.log('NEW LINE vector is ',[x1,y1,z1,vx1,vy1,vz1])
  for(i=0;i<queue.length;i++) {
    let [x2,y2,z2,vx2,vy2,vz2,a2,b2,c2] = queue[i]
    let denominator = (a1*b2) - (a2*b1)
    if (denominator !== 0) {
      let x = ((c1*b2) - (c2*b1)) / denominator
      let y = ((c2*a1) - (c1*a2)) / denominator
      if (x >= testAreaMin && x <= testAreaMax && y>=testAreaMin && y <= testAreaMax){
        if(((x-x1) * vx1) >= 0 && ((y-y1) * vy1) >=0 && ((x-x2) * vx2) >= 0 && ((y-y2) * vy2) >=0) {
          console.log(x,y)
          if(!xyobj[`${x}_${y}`]){
            xyobj[`${x}_${y}`] =true
          } else {
            //console.log(x,',',y)
          }
          intersecting++
        }
      }
    }

  }
}
console.log(intersecting) // Part 1 answer
//console.log(xyobj)


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
console.log('checky is ',checky)
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
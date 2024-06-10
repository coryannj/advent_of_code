const fs = require('fs');
const { only } = require('node:test');
const input = fs.readFileSync('../day22input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/[\r\n]+/)
.map((y)=> y.replace('~',',').split(',').map(Number))
.map((z,zidx)=> [zidx,[z[0],z[3]],[z[1],z[4]],[z[2],z[5]]])
.sort((a,b)=> a[3][0]-b[3][0])
.map(([a,b,c,d],idx)=>[idx,b,c,d])

let bricks = lines.length
let supporting = new Map()
let supportedBy = new Map()

for(a=0;a<bricks;a++) {
  supporting.set(a,[])
  supportedBy.set(a,[])
}

let seen = []
seen.push(lines[0])

// Drop all the bricks
for(a=1;a<bricks;a++) {
  let [aidx,[ax1,ax2],[ay1,ay2],[az1,az2]] = lines[a]
  let lastSupport = seen.findLast(([sidx,[x1,x2],[y1,y2],[z1,z2]])=> Math.max(ax1,x1)<=Math.min(ax2,x2) && Math.max(ay1,y1)<=Math.min(ay2,y2))

  if (lastSupport !== undefined) {
    seen.push([aidx,[ax1,ax2],[ay1,ay2],[lastSupport[3][1]+1,lastSupport[3][1]+1+(az2-az1)]])

  } else {
    seen.push([aidx,[ax1,ax2],[ay1,ay2],[1,1+(az2-az1)]])
  }
  seen.sort((a,b)=>a[3][1]-b[3][1])
}

// Populate supporting and supportedBy maps
for(b=0;b<seen.length-1;b++){
  let [bidx,[bx1,bx2],[by1,by2],[bz1,bz2]] = seen[b]
  let bSupporting = seen.filter(([sidx,[x1,x2],[y1,y2],[z1,z2]])=> z1 === bz2+1 && Math.max(bx1,x1)<=Math.min(bx2,x2) && Math.max(by1,y1)<=Math.min(by2,y2))

  bSupporting.forEach(([sidx,[x1,x2],[y1,y2],[z1,z2]])=>{
    supporting.get(bidx).push(sidx)
    supportedBy.get(sidx).push(bidx)
  })
}

// console.log(supporting)
// console.log(supportedBy)

// Part 1
let canRemove = 0
let canRemoveSeen = new Set()

// Find which bricks are supported by more than one brick && which of those bricks isn't supporting others, or all supporting has multi supports
let manySupports = [...supportedBy.keys()].filter((x)=> supportedBy.get(x).length > 1)

manySupports.forEach((supportedBrick)=>{
  let supports = supportedBy.get(supportedBrick)

  supports.forEach((supporter)=>{
    if(!canRemoveSeen.has(supporter)){
      if (supporting.get(supporter).length === 1){
        //console.log('--TRUE - only supporting one brick')
        canRemove++
        canRemoveSeen.add(supporter)
      } else {
        let otherSupporting = [...supporting.get(supporter)].filter((x)=> x !== supportedBrick)

        if (otherSupporting.every((x)=>supportedBy.get(x).length>1)){
          //console.log('--TRUE - every supporting has other support')
          canRemove++
          canRemoveSeen.add(supporter)
        }
      }
    } 
    
  })
})

// Add bricks which are not supporting anything
let noSupporting = [...supporting.keys()].filter((x)=> supporting.get(x).length === 0);
canRemove+=noSupporting.length;
console.log(canRemove) // Part 1 answer

// Part 2

// Let queue = bricks which are supporting something
let isSupporting= [...supporting.keys()].filter((x)=> supporting.get(x).length>0)
let falling = 0

isSupporting.forEach((x)=>{

  // First iteration we only want bricks with no other supports than x
  let onlySupportedBy = [...supporting.get(x)].filter((y)=>supportedBy.get(y).length === 1);
  let fallen = new Set();
  fallen.add(x);

  // Loop and find which bricks would fall
  while (onlySupportedBy.length>0){
    onlySupportedBy.forEach((el)=> fallen.add(el));
    
    // For subsequent iterations we want all bricks where all supports in fallen set
    let nextOnlySupportedBy = [...supportedBy.keys()].filter((x)=> {
      let supports = supportedBy.get(x)
      return !fallen.has(x) && supports.length>0 && supports.every((z)=> fallen.has(z))
    });
    
    onlySupportedBy=[...new Set(nextOnlySupportedBy)];
  }
  falling += (fallen.size-1) // Add all fallen for this brick to total
})
console.log(falling) // Part 2 answer


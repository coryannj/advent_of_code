const fs = require('fs');
const { only } = require('node:test');
const input = fs.readFileSync('../day22input.txt',{ encoding: 'utf8', flag: 'r' });

// Solution based on https://www.youtube.com/watch?v=imz7uexX394
const lines = input.split(/[\r\n]+/)
.map((y)=> y.replace('~',',').split(',').map(Number))
.sort((a,b)=> a[2]-b[2])
.map((z,zidx)=> [zidx,[z[0],z[3]],[z[1],z[4]],[z[2],z[5]]]); // to use index as key

const bricks = lines.length;

// Populate supporting and supported maps with empty arrays for each indice
let kvArr = Array.from({ length: bricks }, (_, i) => [i,[]]);
let supporting = new Map(JSON.parse(JSON.stringify(kvArr)));
let supportedBy = new Map(JSON.parse(JSON.stringify(kvArr)));

// Drop all the bricks
let seen = []
seen.push(lines[0])
for(a=1;a<bricks;a++) {
  let [aidx,[ax1,ax2],[ay1,ay2],[az1,az2]] = lines[a];
  let lastSupport = seen.findLast(([sidx,[x1,x2],[y1,y2],[z1,z2]])=> Math.max(ax1,x1)<=Math.min(ax2,x2) && Math.max(ay1,y1)<=Math.min(ay2,y2));

  if (lastSupport !== undefined) {
    seen.push([aidx,[ax1,ax2],[ay1,ay2],[lastSupport[3][1]+1,lastSupport[3][1]+1+(az2-az1)]]);
  } else {
    seen.push([aidx,[ax1,ax2],[ay1,ay2],[1,1+(az2-az1)]]);
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
let canRemove = 0;
let canRemoveSeen = new Set();

// Find which bricks are supported by more than one brick && which of those bricks isn't supporting others, or all supporting has multi supports
let manySupports = [...supportedBy.keys()].filter((x)=> supportedBy.get(x).length > 1);

manySupports.forEach((supportedBrick)=>{
  let supports = supportedBy.get(supportedBrick);

  supports.forEach((supporter)=>{
      if (!canRemoveSeen.has(supporter) && (supporting.get(supporter).length === 1 || [...supporting.get(supporter)].every((x)=>supportedBy.get(x).length>1))){
        canRemove++;
        canRemoveSeen.add(supporter);
      }     
  })
})

// Add bricks which are not supporting anything
canRemove+=[...supporting.keys()].filter((x)=> supporting.get(x).length === 0).length;

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


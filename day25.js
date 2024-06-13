const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day25input.txt',{ encoding: 'utf8', flag: 'r' });

// Solution from https://www.reddit.com/r/adventofcode/comments/18qbsxs/comment/keuafrl/ and 
// https://www.reddit.com/r/adventofcode/comments/18qbsxs/comment/kevx4yh/ - use Monte Carlo to iterate over paths between 2 random points, find shortest path, count most seen edges -> top 3 is what we need to cut

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let lines = input.split(/[\r\n]+/).map((x,idx)=> {
  return x.replace(':','').split(' ')
})

// Part 1
let wiring = new Map()

lines.forEach((wire)=>{
  let component = wire.at(0)
  let others = wire.slice(1)
  
  if (!wiring.has(component)){
    wiring.set(component,[])
  }
  
  others.forEach((other)=>{
    wiring.get(component).push(other)
    if(!wiring.has(other)){
      wiring.set(other,[])
    }
    wiring.get(other).push(component)
  })
})

let bridgeMap = {}
let allKeys = [...wiring.keys()];
let allLength = allKeys.length-2;


for(j=0;j<200;j++){ 
  let point1 = allKeys[getRandomInt(allLength)];
  let point2 = allKeys[getRandomInt(allLength)];

  let allPaths = [];
  let seenp = new Set();
  seenp.add(point1);
  let p2pqueue = [[point1]]; // We need to store all nodes in path

  while(allPaths.length === 0 && p2pqueue.length>0){ //Djikstra's for each random pair of points
    let next = p2pqueue.shift();
    let last = next.at(-1);
    let nextVals = wiring.get(last);

    nextVals.forEach((val)=>{
      if(val !== point2){
        if(!seenp.has(val)){
          p2pqueue.push(next.concat(val));
          seenp.add(val);
        }
      } else {
        allPaths.push(next.concat(val))
      }
    })
  }

  let path = allPaths[0]

  for(i=1;i<path.length-1;i++){ // Count all edges in shortest path and store in object
    let thisx = path[i];
    let prevx = path[i-1];
    let nextx = path[i+1];

    let prevKey = thisx<prevx ? `${thisx}_${prevx}` : `${prevx}_${thisx}`
    let nextKey = thisx<nextx ? `${thisx}_${nextx}` : `${nextx}_${thisx}`
    bridgeMap[prevKey] = (bridgeMap[prevKey] ?? 0) + 1;
    bridgeMap[nextKey] = (bridgeMap[nextKey] ?? 0) + 1;
  }
}

// Top 3 edges
let topEdges = [...Object.keys(bridgeMap)].sort((a,b)=> bridgeMap[b]-bridgeMap[a]).flatMap((y)=> [y.split('_')]).slice(0,3)

let [[e1,e2],[e3,e4],[e5,e6]] = topEdges

topEdges.forEach(([n1,n2])=>{
  wiring.set(n1,wiring.get(n1).filter((x)=> x!==n2));
  wiring.set(n2,wiring.get(n2).filter((x)=> x!==n1));
})


// Count all connected nodes in each group
let p1seen = new Set ()
let p1queue = [e1]

while(p1queue.length>0){
  let queueitem = p1queue.shift();
  p1seen.add(queueitem);
  let nextitems = wiring.get(queueitem);
  if(nextitems !== undefined && nextitems.length>0){
    nextitems.forEach((nitem)=>{
      if(!p1seen.has(nitem)){
        p1queue.push(nitem);
      }
    })
  }
}

let p2seen = new Set ()
let p2queue = [e2]

while(p2queue.length>0){
  let queueitem = p2queue.shift();
  p2seen.add(queueitem);
  let nextitems = wiring.get(queueitem);
  if(nextitems !== undefined && nextitems.length>0){
    nextitems.forEach((nitem)=>{
      if(!p2seen.has(nitem)){
        p2queue.push(nitem);
      }
    })
  }
}

console.log(p1seen.size);
console.log(p2seen.size);
console.log(p1seen.size*p2seen.size) // Part 1 answer


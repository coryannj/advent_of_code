const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day25input.txt',{ encoding: 'utf8', flag: 'r' });

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let lines = input.split(/[\r\n]+/).map((x,idx)=> {
  return x.replace(':','').split(' ')
})

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
 let allKeys = [...wiring.keys()]
 let allLength = allKeys.length-2

  let pcounter=0

 for(j=0;j<1000;j++){
  let point1 = allKeys[getRandomInt(allLength)]
  let point2 = allKeys[getRandomInt(allLength)]
  //console.log(point1,point2)
  let allPaths = []
  let seenp = new Set()
  seenp.add(point1)
  let p2pqueue = [[point1]]
  if (point1 !== point2){
    while(allPaths.length=== 0 && p2pqueue.length>0){
      //pcounter++
      //console.log(pcounter)
      let next = p2pqueue.shift()
      //console.log(next)
      let last = next.at(-1)
      //console.log(next,last)
      
      //console.log('next is ',next)
      let nextVals = wiring.get(last)
      //console.log(nextVals)
      if (nextVals !== undefined){
        nextVals.forEach((val)=>{
          if(val !== point2){
            if(!seenp.has(val)){
              //let edgeKey = next<val ? `${next}_${val}` : `${val}_${next}`
              //bridgeMap[edgeKey] = (bridgeMap[edgeKey] ?? 0) + 1;
              p2pqueue.push(next.concat(val))
              seenp.add(val)
              //console.log('queue length',p2pqueue.length)
              //console.log(p2pqueue)
            }
          } else {
            //console.log('next is ',next)
            //console.log('val is ',val)
            allPaths.push(next.concat(val))
            
          }
  
  
        })
      }
      
    }
    //console.log('allpaths ',allPaths)
    //allPaths.sort((a,b)=> a.length-b.length)
    let node = allPaths[0]
    if(allPaths.length>0){
      for(i=1;i<node.length-1;i++){
        let thisx = node[i]
        let prevx = node[i-1]
        let nextx = node[i+1]
    
        let prevKey = thisx<prevx ? `${thisx}_${prevx}` : `${prevx}_${thisx}`
        let nextKey = thisx<nextx ? `${thisx}_${nextx}` : `${nextx}_${thisx}`
        bridgeMap[prevKey] = (bridgeMap[prevKey] ?? 0) + 1;
        bridgeMap[nextKey] = (bridgeMap[nextKey] ?? 0) + 1;
      }
    }
    // let node = [...seenp]

  }


 }

 console.log('Top 5 bridges are ')

 
let mostEdges = [...Object.keys(bridgeMap)].sort((a,b)=> bridgeMap[b]-bridgeMap[a]).map((y)=> [y,bridgeMap[y]]).slice(0,3)
console.log(mostEdges)

let [e1,e2] = mostEdges[0][0].split('_')
let [e3,e4] = mostEdges[1][0].split('_')
let [e5,e6] = mostEdges[2][0].split('_')
console.log(e1,e2,e3,e4,e5,e6)


wiring.set(e1,wiring.get(e1).filter((x)=> x!==e2))
wiring.set(e2,wiring.get(e2).filter((x)=> x!==e1))
wiring.set(e3,wiring.get(e3).filter((x)=> x!==e4))
wiring.set(e4,wiring.get(e4).filter((x)=> x!==e3))
wiring.set(e5,wiring.get(e5).filter((x)=> x!==e6))
wiring.set(e6,wiring.get(e6).filter((x)=> x!==e5))


console.log(wiring.get(e1))
console.log(wiring.get(e2))
console.log(wiring.get(e3))
console.log(wiring.get(e4))
console.log(wiring.get(e5))
console.log(wiring.get(e6))

let p1seen = new Set ()
let p1queue = [e1]

while(p1queue.length>0){
  let queueitem = p1queue.shift()
  p1seen.add(queueitem)
  let nextitems = wiring.get(queueitem)
  if(nextitems !== undefined && nextitems.length>0){
    nextitems.forEach((nitem)=>{
      if(!p1seen.has(nitem)){
        p1queue.push(nitem)
      }
    })
  }
}

let p2seen = new Set ()
let p2queue = [e2]

while(p2queue.length>0){
  let queueitem = p2queue.shift()
  p2seen.add(queueitem)
  let nextitems = wiring.get(queueitem)
  if(nextitems !== undefined && nextitems.length>0){
    nextitems.forEach((nitem)=>{
      if(!p2seen.has(nitem)){
        p2queue.push(nitem)
      }
    })
  }
}

console.log(p1seen.size)
console.log(p2seen.size)
console.log(p1seen.size*p2seen.size) // Part 1 answer


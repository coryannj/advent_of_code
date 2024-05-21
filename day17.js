const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day17input.txt',{ encoding: 'utf8', flag: 'r' });

lines = input.split(/[\r\n]+/).map((x)=> x.split('').map((y)=> parseInt(y)))


let xlength = lines.length
let ylength = lines[0].length

let [startx,starty] = [0,0]
let [endx,endy] = [xlength-1,ylength-1]

let startKey = `${startx}-${starty}`
console.log(startKey)
let endKey = `${endx}-${endy}`
let endVal = lines[endx][endy]

let nextArrSeen = []
let minHeatLoss = 100000000

let adjacencyList = {}
let listQueue = [[startx,starty]]

while (!!listQueue.length) {
  var [r,c] = listQueue.shift()
  if (adjacencyList[`${r}-${c}`] === undefined) {
    adjacencyList[`${r}-${c}`] = {}
  }

  var nextArr = [
    [r+1,c,'D'],[r-1,c,'U'],[r,c-1,'L'],[r,c+1,'R'],
    [r+2,c,'DD'],[r-2,c,'UU'],[r,c-2,'LL'],[r,c+2,'RR'],
    [r+3,c,'DDD'],[r-3,c,'UUU'],[r,c-3,'LLL'],[r,c+3,'RRR']
  ].filter(([row,col,dir])=> row >= 0 && row <= xlength-1 && col >= 0 && col <= ylength-1 &&lines[row][col] !== '.' && adjacencyList[`${r}-${c}`][`${row}-${col}`] === undefined).map(([row,col,dir])=>[row,col,dir,lines[row][col]]).map(([r,c,dir,dist],idx,arr)=>{
    if(arr.findIndex((el)=> el[2].includes(dir.slice(-1))) === idx) {
      return [r,c,dir,dist]
    } else {
      let prev = arr.filter((x,xidx)=> xidx<idx && x[2].includes(dir.slice(-1))).map((y)=>y[3]).reduce((acc,curr)=>acc+curr)
      return [r,c,dir,prev+dist]
    }
  })
  
  if (r === startx || r === endx) {
    nextArr = nextArr.filter((x)=> !x[2].includes('L'))
  }

  if (c === starty || c === endy) {
    nextArr = nextArr.filter((x)=> !x[2].includes('U'))
  }

  nextArr.forEach(([rn,cn,dn,di])=> { 
      adjacencyList[`${r}-${c}`][`${rn}-${cn}`] = {}
      adjacencyList[`${r}-${c}`][`${rn}-${cn}`]['distance'] = di
      adjacencyList[`${r}-${c}`][`${rn}-${cn}`]['direction'] = dn
      if(listQueue.findIndex(([listx,listy]) => listx === rn && listy === cn) === -1) {
        listQueue.push([rn,cn])
      }
  })
}

//console.log(adjacencyList)

let shortestMap = {}


shortestMap[startKey]=[0,startKey]
let visited = new Set()
let pqueue = '.'.repeat(20000).split('').map((x)=>[])
let piterations = 0
pqueue[0].push([0,'XYZ',startKey])

while(pqueue.findIndex((x)=> x.length>0) !== -1) {
  //while(piterations<100){
  piterations++
  var [pdist,plast3,pkey] = pqueue[pqueue.findIndex((x)=> x.length>0)].shift()

  let backwards = {
    'R':'L',
    'L':'R',
    'U':'D',
    'D':'U'
  }

  let backwardsDir = backwards[plast3.slice(-1)]

  // console.log(' ')
  // console.log('*** NEW ITERATION ***')
  // console.log(pdist,plast3,pkey,backwardsDir)

  for (const [nkey,nvalue] of Object.entries(adjacencyList[pkey])) {
    var updatedDistance = pdist + nvalue.distance
    // console.log(' ')
    // console.log('*** Key loop ***')
    // console.log(nkey)
    // console.log(nvalue)
    // console.log('shortestMap[nkey] is ',shortestMap[nkey])
    // console.log('updated distance is ',updatedDistance)
    
    if (!nvalue.direction.includes(backwardsDir) && !`${plast3}${nvalue.direction}`.includes(plast3.slice(-1).repeat(4)) && (shortestMap[nkey] === undefined || shortestMap[nkey][nvalue.direction.slice(-1)] === undefined ||updatedDistance <= shortestMap[nkey][nvalue.direction.slice(-1)][0])) {
      //console.log('key is valid')

      if (shortestMap[nkey] === undefined) {
        shortestMap[nkey] = {}
      }

      if (shortestMap[nkey][nvalue.direction.slice(-1)] === undefined || updatedDistance < shortestMap[nkey][nvalue.direction.slice(-1)][0]) {
        shortestMap[nkey][nvalue.direction.slice(-1)]=[updatedDistance,[pkey]]
      } else {
        if (!shortestMap[nkey][nvalue.direction.slice(-1)][1].includes(pkey)){
          shortestMap[nkey][nvalue.direction.slice(-1)][1].push(pkey)
        }
      }

      // if(shortestMap[nkey] === undefined || updatedDistance < shortestMap[nkey][0]) {
      //   shortestMap[nkey] = [updatedDistance,[pkey]]
      // }
      // if (updatedDistance === shortestMap[nkey][0] && !shortestMap[nkey][1].includes(pkey)) {
      //   shortestMap[nkey][1].push(pkey)
      // }

      //shortestMap[nkey].unshift([updatedDistance,pkey])
      // console.log('shortestMap[key] after is ',shortestMap[nkey])
      // console.log(!visited.has(`${pkey}_${nkey}`))
      //if (!visited.has(`${pkey}_${nkey}`) && nkey !== endKey) {
        if (nkey !== endKey) {

        let nextItem = [updatedDistance,`${plast3}${nvalue.direction}`.slice(-3),nkey]
        
        // let nextItem = [updatedDistance,`${plast3}${value.direction}`.slice(-3),nkey]
        if (!visited.has(nextItem.join('_'))) {
          //console.log('added to queue')
          pqueue[updatedDistance].push(nextItem)

          visited.add(nextItem.join('_'))
        }

        
        //console.log('added to pqueue ',nextItem)
      } else {
        console.log('end was reached on iteration ',piterations,' pathHeatLoss is ',updatedDistance)
        //break;
      }
    }
  }
  // console.log('queue is ')
  // console.log(pqueue)
  // console.log('shortest map is ')
  // console.log(shortestMap)

}
//console.log(shortestMap)


// Part 2
let p2adjacencyList = {}
let p2listQueue = [[startx,starty]]
let p2QueueIterations = 0
//while(p2QueueIterations<10){
while (!!p2listQueue.length) {
  p2QueueIterations++
  var [r,c] = p2listQueue.shift()
  if (p2adjacencyList[`${r}-${c}`] === undefined) {
    p2adjacencyList[`${r}-${c}`] = {}
  }

  var beforeObj = {
    'D':[[r+1,c],[r+2,c],[r+3,c]],
    'U':[[r-1,c],[r-2,c],[r-3,c]],
    'L':[[r,c-1],[r,c-2],[r,c-3]],
    'R':[[r,c+1],[r,c+2],[r,c+3]]
  } 

  var nextArr = [
    [r+4,c,'DDDD'],[r-4,c,'UUUU'],[r,c-4,'LLLL'],[r,c+4,'RRRR'],
    [r+5,c,'DDDDD'],[r-5,c,'UUUUU'],[r,c-5,'LLLLL'],[r,c+5,'RRRRR'],
    [r+6,c,'DDDDDD'],[r-6,c,'UUUUUU'],[r,c-6,'LLLLLL'],[r,c+6,'RRRRRR'],
    [r+7,c,'DDDDDDD'],[r-7,c,'UUUUUUU'],[r,c-7,'LLLLLLL'],[r,c+7,'RRRRRRR'],
    [r+8,c,'DDDDDDDD'],[r-8,c,'UUUUUUUU'],[r,c-8,'LLLLLLLL'],[r,c+8,'RRRRRRRR'],
    [r+9,c,'DDDDDDDDD'],[r-9,c,'UUUUUUUUU'],[r,c-9,'LLLLLLLLL'],[r,c+9,'RRRRRRRRR'],
    [r+10,c,'DDDDDDDDDD'],[r-10,c,'UUUUUUUUUU'],[r,c-10,'LLLLLLLLLL'],[r,c+10,'RRRRRRRRRR']
  ].filter(([row,col,dir])=> row >= 0 && row <= xlength-1 && col >= 0 && col <= ylength-1 && p2adjacencyList[`${r}-${c}`][`${row}-${col}`] === undefined).map(([row,col,dir])=>[row,col,dir,lines[row][col]]).map(([r,c,dir,dist],idx,arr)=>{
    let beforeDist = beforeObj[dir.slice(-1)].map((x)=>lines[x[0]][x[1]]).reduce((acc,curr)=>acc+curr)
    if(arr.findIndex((el)=> el[2].includes(dir.slice(-1))) === idx) {
      return [r,c,dir,beforeDist+dist]
    } else {
      let prev = arr.filter((x,xidx)=> xidx<idx && x[2].includes(dir.slice(-1))).map((y)=>y[3]).reduce((acc,curr)=>acc+curr)
      return [r,c,dir,beforeDist+prev+dist]
    }
  })
  
  if (r === startx || r === endx) {
    nextArr = nextArr.filter((x)=> !x[2].includes('L'))
  }

  if (c === starty || c === endy) {
    nextArr = nextArr.filter((x)=> !x[2].includes('U'))
  }

  nextArr.forEach(([rn,cn,dn,di])=> { 
      p2adjacencyList[`${r}-${c}`][`${rn}-${cn}`] = {}
      p2adjacencyList[`${r}-${c}`][`${rn}-${cn}`]['distance'] = di
      p2adjacencyList[`${r}-${c}`][`${rn}-${cn}`]['direction'] = dn
      if(p2listQueue.findIndex(([listx,listy]) => listx === rn && listy === cn) === -1) {
        p2listQueue.push([rn,cn])
      }
  })
}

//console.log(p2adjacencyList)


let p2shortestMap = {}


p2shortestMap[startKey]=[0,startKey]
let p2visited = new Set()
let p2pqueue = '.'.repeat(20000).split('').map((x)=>[])
let p2piterations = 0
p2pqueue[0].push([0,'XYZXYZXYZX',startKey])

while(p2pqueue.findIndex((x)=> x.length>0) !== -1) {
  //while(p2piterations<10){
  p2piterations++
  var [pdist,plast3,pkey] = p2pqueue[p2pqueue.findIndex((x)=> x.length>0)].shift()

  let backwards = {
    'R':'L',
    'L':'R',
    'U':'D',
    'D':'U'
  }

  let backwardsDir = backwards[plast3.slice(-1)]

  // console.log(' ')
  // console.log('*** NEW ITERATION ***')
  // console.log(pdist,plast3,pkey,backwardsDir)

  for (const [nkey,nvalue] of Object.entries(p2adjacencyList[pkey])) {
    var updatedDistance = pdist + nvalue.distance
    // console.log(' ')
    // console.log('*** Key loop ***')
    // console.log(nkey)
    // console.log(nvalue)
    // console.log('shortestMap[nkey] is ',shortestMap[nkey])
    // console.log('updated distance is ',updatedDistance)
    
    if (!nvalue.direction.includes(backwardsDir) && !`${plast3}${nvalue.direction}`.includes(plast3.slice(-1).repeat(11)) && (p2shortestMap[nkey] === undefined || p2shortestMap[nkey][nvalue.direction.slice(-1)] === undefined ||updatedDistance <= p2shortestMap[nkey][nvalue.direction.slice(-1)][0])) {
      //console.log('key is valid')

      if (p2shortestMap[nkey] === undefined) {
        p2shortestMap[nkey] = {}
      }

      if (p2shortestMap[nkey][nvalue.direction.slice(-1)] === undefined || updatedDistance < p2shortestMap[nkey][nvalue.direction.slice(-1)][0]) {
        p2shortestMap[nkey][nvalue.direction.slice(-1)]=[updatedDistance,[pkey]]
      } else {
        if (!p2shortestMap[nkey][nvalue.direction.slice(-1)][1].includes(pkey)){
          p2shortestMap[nkey][nvalue.direction.slice(-1)][1].push(pkey)
        }
      }

      // if(shortestMap[nkey] === undefined || updatedDistance < shortestMap[nkey][0]) {
      //   shortestMap[nkey] = [updatedDistance,[pkey]]
      // }
      // if (updatedDistance === shortestMap[nkey][0] && !shortestMap[nkey][1].includes(pkey)) {
      //   shortestMap[nkey][1].push(pkey)
      // }

      //shortestMap[nkey].unshift([updatedDistance,pkey])
      // console.log('shortestMap[key] after is ',shortestMap[nkey])
      // console.log(!visited.has(`${pkey}_${nkey}`))
      //if (!visited.has(`${pkey}_${nkey}`) && nkey !== endKey) {
        if (nkey !== endKey) {

        let nextItem = [updatedDistance,`${plast3}${nvalue.direction}`.slice(-10),nkey]
        
        // let nextItem = [updatedDistance,`${plast3}${value.direction}`.slice(-3),nkey]
        if (!p2visited.has(nextItem.join('_'))) {
          //console.log('added to queue')
         p2pqueue[updatedDistance].push(nextItem)

          p2visited.add(nextItem.join('_'))
        }

        
        //console.log('added to pqueue ',nextItem)
      } else {
        console.log('end was reached on iteration ',p2piterations,' pathHeatLoss is ',updatedDistance)
        //break;
      }
    }
  }
  // console.log('queue is ')
  // console.log(pqueue)
  // console.log('shortest map is ')
  // console.log(shortestMap)

}
console.log(p2shortestMap)
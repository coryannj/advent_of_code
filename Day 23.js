const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day23input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/[\r\n]+/).map((x)=> x.split(''))
let xlength = lines.length
let ylength = lines[0].length

let [startx,starty] = [0,lines[0].indexOf('.')]
let [endx,endy] = [ylength-1,lines[ylength-1].indexOf('.')]

// To remove need for bounds checking - remember to add 2 to final answers
lines[startx][starty] = '#'
lines[endx][endy]='#'

let [newstartx,newstarty] = [1,lines[1].indexOf('.')]
let [newstartx1,newstarty1] = [2,lines[2].indexOf('.')]
let [newendx,newendy] = [ylength-2,lines[ylength-2].lastIndexOf('.')]
let newStartKey = `${newstartx}-${newstarty}`
let newStart1Key = `${newstartx1}-${newstarty1}`
let newEndKey = `${newendx}-${newendy}`

// Part 1

let graph = {}
let seen = []
let priorityQueue = [[0,newStartKey,newStartKey,newStart1Key]]

// Generate graph
while (!!priorityQueue.length) {
  var [distancep,startKeyp,prevKeyp,thisKeyp] = priorityQueue.shift();
  var [r,c] = thisKeyp.split('-').map((x)=> parseInt(x));

  var filterArr
  var nextArr = [[r+1,c,'R'],[r-1,c,'U'],[r,c-1,'L'],[r,c+1,'D']].filter(([row,col,dir])=> lines[row][col] !== '#')

  if (nextArr.length === 2) { // On single path between vertices
    filterArr = nextArr.find((x)=> `${x[0]}-${x[1]}` !== prevKeyp);
    priorityQueue.push([distancep+1,startKeyp,thisKeyp,`${filterArr[0]}-${filterArr[1]}`]);
  } else { // Found vertice or end of maze or no more path
    if (nextArr.length > 0) {
      
      if (graph[startKeyp] === undefined) {
          graph[startKeyp] = {};
      };
      
      graph[startKeyp][thisKeyp] = distancep+1;

      if (nextArr.length > 2 && !seen.includes(thisKeyp)) {
        filterArr = nextArr.filter((x)=> x[2]=== 'R'|| x[2]=== 'D');

        filterArr.forEach(([nx,ny,dir])=>{
          priorityQueue.push([0,thisKeyp,thisKeyp,`${nx}-${ny}`]);
        })
      
        seen.push(thisKeyp);
      }
    }
  }
}
//console.log(graph)

// Generate paths
let pathQueue = [[0,[newStartKey]]]
let iterationCount = 0
let longestCount = 0
let longestKeys

while (pathQueue.length > 0) {
  iterationCount++;
  var [distancep,seenp] = pathQueue.shift();
  var lastkeyp = seenp[seenp.length-1];
  var nextValsp = Object.keys(graph[lastkeyp]).filter((x)=> !seenp.includes(x));
  if (nextValsp.length > 0) {
    nextValsp.forEach((nextVal)=> {
        var nextQueueItemp = [distancep+graph[lastkeyp][nextVal]]
        nextQueueItemp.push(seenp.concat(nextVal))
        
        if (nextVal === newEndKey) {
  
          if (nextQueueItemp[0]> longestCount) {
            longestCount = nextQueueItemp[0]+2
            longestKeys = nextQueueItemp[1].join('_')
            //console.log('valid path found on iteration ',iterationCount,', distance is ', longestCount,' and keys are ',longestKeys.split('_'))
          }
        } else {
          pathQueue.push(nextQueueItemp)
        }
    })
  }
}
console.log('Part 1 answer is ',longestCount) // Part 1 answer
console.log('Total iterations ',iterationCount)
//console.log(longestKeys.split('_')) // Vertices in longest path

// Part 2

// Add paths to all the inner vertices (ignoring perimeter)
let innerKeys = Object.keys(graph).filter((key)=>{
  var [r,c] = key.split('-').map((x)=> parseInt(x))
  var surrounding = [[r+1,c],[r-1,c],[r,c-1],[r,c+1]].filter(([row,col])=> lines[row][col] !== '#' && lines[row][col] !== '.')
  return surrounding.length === 4
})

innerKeys.forEach((innerKey)=> {
  var [r,c] = innerKey.split('-').map((x)=> parseInt(x))
  //console.log([r,c])
  var nextArr = [[r+1,c],[r-1,c],[r,c-1],[r,c+1]]
  nextArr.forEach((next)=> {
    priorityQueue.push([0,innerKey,innerKey,`${next[0]}-${next[1]}`]);
  })
})

// Generate inner graph
while (!!priorityQueue.length) {
  var [distancep,startKeyp,prevKeyp,thisKeyp] = priorityQueue.shift();
  var [r,c] = thisKeyp.split('-').map((x)=> parseInt(x));

  var nextArr = [[r+1,c],[r-1,c],[r,c-1],[r,c+1]].filter(([row,col])=> lines[row][col] !== '#' && `${row}-${col}` !== prevKeyp)

  if (nextArr.length === 1) { // On single path between vertices
    priorityQueue.push([distancep+1,startKeyp,thisKeyp,`${nextArr[0][0]}-${nextArr[0][1]}`]);

  } else { // Found vertice
    graph[startKeyp][thisKeyp] = distancep+1

    if (graph[thisKeyp][startKeyp] === undefined) { // Set reverse direction
      graph[thisKeyp][startKeyp] = distancep+1
    }
  }
}

// Edge contraction -  graph start
let firstEntry = Object.entries(graph[newStartKey]).flat()

for (const [key,value] of Object.entries(graph[firstEntry[0]])) {
  var newVal = value+firstEntry[1]+1
  graph[firstEntry[0]][key] = newVal
}

delete graph[newStartKey]

// Edge contraction - graph end
let lastEntryKey = Object.keys(graph).filter(x=> Object.hasOwn(graph[x],newEndKey)).flat()
let lastEntryVal = graph[lastEntryKey][newEndKey]

let hasLast = Object.keys(graph).filter(x=> Object.hasOwn(graph[x],lastEntryKey))

hasLast.forEach((hasKey)=> {
  var newVal = graph[hasKey][lastEntryKey] + lastEntryVal + 1
  graph[hasKey][lastEntryKey] = newVal
})
delete graph[lastEntryKey]

//console.log(graph)

/* ------ Assumptions ------- 
(works without these, just a lot slower)
1. Longest path must take first 6 perimeter nodes in either direction ( to get longest vals 472/438 in the corners)
2. Longest path must have over 30 nodes
*/

let p2startKey = firstEntry[0]
let p2endKey = lastEntryKey[0]
console.log(p2startKey,p2endKey)

let first6Queue = [[0,[p2startKey]]]
let p2longest = 0
let p2longestKeys
let p2iterations = 0

while (!!first6Queue.length) {
  var [distance,keys] = first6Queue.shift()

  var lastKey = keys[keys.length-1]
  var nextArr = Object.keys(graph[lastKey]).filter((x)=> Object.keys(graph[x]).length < 4)

  if (keys.length<6) {
    nextArr.forEach((nextItem)=> {
      let newQueueItem = [distance+graph[lastKey][nextItem]]
      newQueueItem.push(keys.concat(nextItem))
      first6Queue.push(newQueueItem)
    })
  } else {
    priorityQueue.push([distance,keys])
  }
}
//priorityQueue = [[0,[p2startKey]]]
console.log('priorityQueue is ',priorityQueue)

// Brute force all paths

while (!!priorityQueue.length){
  p2iterations++
  var [p2distance,p2seen] = priorityQueue.shift()
  //var lastkey = p2seen[p2seen.length-1]
  var lastkey = p2seen.slice(-1).flat()
  //var nextVals

  if (p2seen.length < 30) {
    Object.keys(graph[lastkey]).filter((x)=>!p2seen.includes(x) && x !== '135-129').forEach((nextVal)=> {
      priorityQueue.push([p2distance+graph[lastkey][nextVal],p2seen.concat(nextVal)]);
    })
  } else {
    Object.keys(graph[lastkey]).filter((x)=>!p2seen.includes(x)).forEach((nextVal)=> {
      var nextDistance = p2distance+graph[lastkey][nextVal];
      if (nextVal === '135-129') {
        if (nextDistance> p2longest) {
          p2longest = nextDistance
          //p2longestKeys = nextQueueItem[1].join('_')
          //console.log('valid path found on iteration ',p2iterations,', p2distance is ', p2longest)
        } else {
          // do nothing
        }
      } else {
        priorityQueue.push([nextDistance,p2seen.concat(nextVal)]);
      }
    })
  }
} 

console.log('longest is ',p2longest)
console.log('total iteration is ', p2iterations)
//console.log('total iteration is ',i)
//console.log('longest path is ',p2longestKeys.split('_'))

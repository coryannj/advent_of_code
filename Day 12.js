const fs = require('fs');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

// const readData = () => {
//     const data = input
//       .split(/\r?\n/)
//       .map(s => s.split(""))
//       .filter(Boolean)
  
//     const [numberOfRows, numberOfCols] = [data.length, data[0].length]
  
//     let start, end
  
//     for (let row = 0; row < numberOfRows; row++) {
//       for (let col = 0; col < numberOfCols; col++) {
//         if (data[row][col] === "S") {
//           start = [row, col]
//           data[row][col] = "a"
//         } else if (data[row][col] === "E") {
//           end = [row, col]
//           data[row][col] = "z"
//         }
//       }
//     }
  
//     return { grid: data, start, end, numberOfRows, numberOfCols }
//   }
  
//   const main = () => {
//     const { grid, end, numberOfRows, numberOfCols } = readData()
  
//     const posToStr = ([row, col]) => `${row} ${col}`
//     const isPosInGrid = ([row, col]) =>
//       row >= 0 && row < numberOfRows && col >= 0 && col < numberOfCols
//     const isAtMostOneHigher =
//       currentElevation =>
//       ([row, col]) =>
//         grid[row][col].charCodeAt(0) - currentElevation.charCodeAt(0) <= 1
//     const isElevationA = ([row, col]) => grid[row][col] === "a"
  
//     const DIRS = [
//       [-1, 0],
//       [1, 0],
//       [0, -1],
//       [0, 1],
//     ]
  
//     const bfs = start => {
//       const queue = [[start, 0]]
//       const visited = new Set([posToStr(start)])
//       let res = Number.POSITIVE_INFINITY
  
//       while (queue.length) {
//         const [pos, steps] = queue.shift()
  
//         if (posToStr(pos) === posToStr(end)) {
//           res = steps
//           break
//         }
  
//         DIRS.map(([dRow, dCol]) => [pos[0] + dRow, pos[1] + dCol])
//           .filter(isPosInGrid)
//           .filter(isAtMostOneHigher(grid[pos[0]][pos[1]]))
//           .filter(pos => !visited.has(posToStr(pos)))
//           .forEach(pos => {
//             visited.add(posToStr(pos))
//             queue.push([pos, steps + 1])
//           })
//       }
  
//       return res
//     }
  
//     const starts = Array.from({ length: numberOfRows }, (_, row) =>
//       Array.from({ length: numberOfRows }, (_, col) => [row, col])
//     )
//       .flat()
//       .filter(isElevationA)
  
//     const res = Math.min(...starts.map(bfs))
  
//     console.log(res)
//   }
  
//   main()




let elevation = 'SabcdefghijklmnopqrstuvwxyzE'

const lines = input.split(/[\r\n]+/).map((x)=> x.split('').map((y)=> elevation.indexOf(y)))

//console.log(lines[0].join(''))
//console.log(lines[0].map((x)=>elevation.charAt(x)).join(''))
let rowlen = lines.length
let collen = lines[0].length

let points = rowlen*collen
console.log(rowlen,collen,points)

let endrow = lines.findIndex((x)=> x.includes(27))
let endcol = lines[endrow].findIndex((x)=> x === 27)
let startrow = lines.findIndex((x)=> x.includes(0))
let startcol = lines[startrow].findIndex((x)=> x === 0)
console.log(endrow,endcol,startrow,startcol)

let allPaths = [];
let seenp = new Set();
seenp.add(`${startrow}_${startcol}`);
//seenp.add(`${endrow}_${endcol}`);
//let queue = [[0,[endrow,endcol]]]
let queue = [[0,[startrow,startcol]]]

//let queue = '.'.repeat(points+1).split('').map((x)=>[])
//console.log(queue.length)

//queue[0].push([0,[startrow,startcol]])
//console.log(queue)
//console.log(queue.findIndex((x)=> x.length>0) !== -1)

//queue[0].push([[endrow,endcol]])
//console.log(queue[0])
//console.log(queue)
let counter = 0
while(queue.length>0){
//while(allPaths.length === 0 && queue.length>0){ //Djikstra's for each random pair of points
//while(allPaths.length === 0 && queue.findIndex((x)=> x.length>0) !== -1){
    //while(queue.findIndex((x)=> x.length>0) !== -1){
    //let nextSeen = []
    //let nextQueue = []
    

    //while(queue.length>0) {
        counter ++
        //let next = queue[queue.findIndex((x)=> x.length>0)].shift()
        let next = queue.shift()
        let lastDistance = next[0]
        //console.log(' next length is ',next.length, 'last next is ',next.at(-1))
        //console.log(next.slice(1).map((x)=> elevation.charAt(lines[x[0]][x[1]])))
        let [lastx,lasty] = next.at(-1);
        //nextSeen.push(`${lastx}_${lasty}`);
        //seenp.add(`${lastx}_${lasty}`)

        let nextArr = [[lastx,lasty+1],[lastx,lasty-1],[lastx+1,lasty],[lastx-1,lasty]].filter(([rowind,colind])=> 
            !seenp.has(`${rowind}_${colind}`) 
            && 0 <= rowind && rowind< rowlen 
            && 0<= colind && colind<collen 
            && (lines[rowind][colind]<= lines[lastx][lasty]+1))
            //&& (colind<=10 || colind>10 && lines[rowind][colind] !== 1)
            //&& (lines[rowind][colind]>= lines[lastx][lasty]-1))

        nextArr.forEach(([nextrow,nextcol])=>{
            
            let toNext = next.slice(0)
            toNext[0]++
            //let nextDistance = lastDistance + lines[nextrow][nextcol]
            //let nextDistance = lines[nextrow][nextcol]
            //let nextDistance = toNext.length+1
            //console.log('nextDistance ',nextDistance)
            
            toNext.push([nextrow,nextcol])
            
            //nextSeen.push(`${nextrow}_${}`)
            //if (lines[nextrow][nextcol] === 3){
            //if(lines[nextrow][nextcol]===1){
            if (nextrow === endrow && nextcol === endcol){
                allPaths.push(toNext)
            } else {
                
                seenp.add(`${nextrow}_${nextcol}`)
                    queue.push(toNext);
                    //console.log('not in queue, queue length now ',queue.length)
                

                
                //queue.sort((a,b)=> lines[b.at(-1)[0]][b.at(-1)[1]]-lines[a.at(-1)[0]][a.at(-1)[1]])
                //queue[nextDistance].sort((a,b)=> a.length-b.length)
            }
        })
    //}

    //nextSeen.forEach((seen)=> seenp.add(seen))
    //queue = nextQueue
    //console.log(queue.at(-1).length,queue.length)
    if (counter%100000 === 0){
        console.log('counter is ',counter,'smallest distance path length is ',queue[0].length, 'queue length is ',queue.length)
        console.log('path is ',queue[0])
        console.log(queue[0].slice(1).map((y)=> elevation.charAt(lines[y[0]][y[1]])))
    }
    

  }

  console.log('allpaths length',allPaths.length)
  let path = allPaths[0]
  console.log('path that reached end',path)
  console.log('path length ',path.length,path[0])
  console.log(path.slice(1).map((y)=> elevation.charAt(lines[y[0]][y[1]])))
let actualPath = path.slice(1)
console.log('actual path length ',actualPath.length)

actualPath.forEach(([r,c])=>{
    lines[r][c] = '.'
})

lines.forEach((line,lineidx)=>{
    line.forEach((char,charidx)=>{
        if(char !== '.'){
            lines[lineidx][charidx] = elevation.charAt(char)
        }
    })
    
    console.log(line.join(''))
})

  console.log('*** length of paths that reached end ',allPaths.map((x)=>x.length).sort((a,b)=>a-b))

//   console.log(path)
//   console.log(path.length)

//   path.forEach(([x,y])=>{
//     lines[x][y] = '.'
//   })

//   lines.forEach((line)=> console.log(line.join('')))



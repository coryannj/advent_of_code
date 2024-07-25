const fs = require('fs');
const input = fs.readFileSync('../day15input.txt',{ encoding: 'utf8', flag: 'r' });
const {
    PriorityQueue,
    MinPriorityQueue,
    MaxPriorityQueue,
  } = require('@datastructures-js/priority-queue');
let lines = input.split(/[\r\n]+/).map((x)=>x.split('').map(Number))

// Part 1
let [rowLen,colLen] = [lines.length,lines[0].length]
let [endRow,endCol] = [rowLen-1,colLen-1]
let endKey = [endRow,endCol].join('-')

let start = [0,[0,0]]
let seen = []
let shortest = {}
let shortestPath = 999999

let queue = Array(1000).fill('.').map((x)=>[])
queue[0].push(start)

while(queue.findIndex((x)=>x.length>0) !== -1){
    let [dist,[r,c]] = queue[queue.findIndex((x)=>x.length>0)].shift();

    let nextArr = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([nr,nc])=>0 <= nr && nr < rowLen && 0 <= nc && nc < colLen && !seen.includes(`${nr}-${nc}`) && (shortest[`${nr}-${nc}`] === undefined || shortest[`${nr}-${nc}`]>dist+lines[nr][nc]))

    nextArr.forEach(([dr,dc])=>{
        let newDist = dist+lines[dr][dc]
        
        if(shortest[`${dr}-${dc}`]===undefined){
            shortest[`${dr}-${dc}`] = newDist
            if(`${dr}-${dc}` === endKey){
                shortestPath=newDist;
            }
        } else {
            shortest[`${dr}-${dc}`]=newDist;

            if(`${dr}-${dc}` === endKey){
                shortestPath=newDist
            }
        }

        if(`${dr}-${dc}` !== endKey){
            queue[newDist].push([newDist,[dr,dc]])
        }
    })
    seen.push(`${r}-${c}`)
    
}

console.log(shortest[`${endRow}-${endCol}`]) // Part 1 answer

// Part 2
let row = Array(colLen*5).fill(0).map((x)=>x)
let grid = Array(rowLen*5).fill('.').map((x)=>row.slice())

for(i=0;i<rowLen*5;i++){
    for(j=0;j<colLen*5;j++){
        if(i<rowLen && j<colLen){
            grid[i][j] = lines[i][j]
        } else if (i<rowLen && j>=colLen){
            let newVal = lines[i][j%colLen]+Math.floor(j/colLen)
            grid[i][j] = newVal>9 ? newVal-9 : newVal

        } else if (i>=rowLen && j< colLen){
            let newVal = lines[i%rowLen][j]+Math.floor(i/rowLen)
            grid[i][j] = newVal>9 ? newVal-9 : newVal

        } else {
            let newVal = lines[i%rowLen][j%colLen]+Math.floor(j/colLen)+Math.floor(i/rowLen)
            grid[i][j] = newVal>9 ? newVal-9 : newVal
        }
    }
}

let p2start = [0,[0,0]]
let p2seen = []
let p2shortest = {}
let p2shortestPath = 999999
let [p2rowLen,p2colLen] = [grid.length,grid[0].length]
let [p2endRow,p2endCol] = [p2rowLen-1,p2colLen-1]
let p2endKey = [p2endRow,p2endCol].join('-')

let p2queue = Array(3000).fill('.').map((x)=>[])
p2queue[0].push(p2start)

while(p2queue.findIndex((x)=>x.length>0) !== -1){
    let [dist,[r,c]] = p2queue[p2queue.findIndex((x)=>x.length>0)].shift();

    let nextArr = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([nr,nc])=>0 <= nr && nr < p2rowLen && 0 <= nc && nc < p2colLen && !p2seen.includes(`${nr}-${nc}`) && (p2shortest[`${nr}-${nc}`] === undefined || p2shortest[`${nr}-${nc}`]>dist+grid[nr][nc]));

    nextArr.forEach(([dr,dc])=>{
        let newDist = dist+grid[dr][dc];
        
        if(p2shortest[`${dr}-${dc}`]===undefined){
            p2shortest[`${dr}-${dc}`] = newDist;
            if(`${dr}-${dc}` === p2endKey){
                p2shortestPath=newDist
            }
            
        } else {

            p2shortest[`${dr}-${dc}`]=newDist;

            if(`${dr}-${dc}` === p2endKey){
                p2shortestPath=newDist;
            }
        }

        if(`${dr}-${dc}` !== p2endKey){
            p2queue[newDist].push([newDist,[dr,dc]])
        }
    })
    p2seen.push(`${r}-${c}`)
   

}

console.log(p2shortest[`${p2endRow}-${p2endCol}`])
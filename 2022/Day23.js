const fs = require('fs');

const input = fs.readFileSync('../day23input.txt',{ encoding: 'utf8' });

let elfList = input.split(/[\r\n]+/).map((x)=>x.split('')).flatMap((x,ix)=>x.map((y,iy)=>y==='#'?[ix,iy]:[])).filter((z)=>z.length>0)

let rounds = 2000

let startTime = performance.now()
let directionIndex = 0
let currPosition = elfList
let elvesLength = elfList.length

for(noOfRounds = 0;noOfRounds<rounds;noOfRounds++){
    let actualMoves = []
    let duplicateMoves = []
    let sameMoveCheck = 0

    for(i=0;i<elvesLength;i++){
        let [r,c] = currPosition[i]
        let surroundingRC = [[r-1,c-1],[r-1,c],[r-1,c+1],[r,c+1],[r+1,c+1],[r+1,c],[r+1,c-1],[r,c-1]]
        let surrounding = surroundingRC.map(([sr,sc])=> !currPosition.some(([ar,ac])=>ar === sr && ac === sc))
        
        if(surrounding.every((x)=> x === true)){
            actualMoves.push([r,c])
            sameMoveCheck++
            continue;
        } else {
            let next = []
            let dirs = [0,1,2,3].slice(directionIndex%4).concat([0,1,2,3].slice(0,directionIndex%4))
            
            while(next.length === 0 && dirs.length>0){
                let nx = dirs.shift()
                if(nx===0 && ![surrounding[0],surrounding[1],surrounding[2]].includes(false)){
                    next= surroundingRC[1]
                }
                if (nx===1 && ![surrounding[4],surrounding[5],surrounding[6]].includes(false)){
                        next= surroundingRC[5]
                } 
                if (nx===2 && ![surrounding[0],surrounding[6],surrounding[7]].includes(false)){
                    next= surroundingRC[7]
                } 
                if(nx===3 && ![surrounding[2],surrounding[3],surrounding[4]].includes(false)){
                    next= surroundingRC[3]
                }
            }
            
            if (next.length === 0){
                actualMoves.push([r,c])
                sameMoveCheck++
            } else {
                if(actualMoves.some(([ar,ac])=>ar === next[0] && ac === next[1])){
                    duplicateMoves.push(next)
                    actualMoves.push([r,c])
                    sameMoveCheck++
                } else {
                    actualMoves.push(next)
                }
                
            }

        }

    }

    if (duplicateMoves.length>0){
        duplicateMoves.forEach(([dr,dc])=>{
            let lastSeenIndex = -1
            while(actualMoves.findIndex(([ar,ac])=>ar === dr && ac === dc) > lastSeenIndex){
                lastSeenIndex = actualMoves.findIndex(([ar,ac])=>ar === dr && ac === dc)
                
                actualMoves[lastSeenIndex] = currPosition[lastSeenIndex]
                if(currPosition[lastSeenIndex][0]===dr && currPosition[lastSeenIndex][1]===dc){
                    sameMoveCheck++
                }
                
            }
        })
    }

    if(sameMoveCheck === elvesLength){
        break;
    }
    
    currPosition = actualMoves
    directionIndex++

    if(noOfRounds === 9){
        let rows = currPosition.map((x)=>x[0]).sort((a,b)=> a-b)
        let cols = currPosition.map((x)=>x[1]).sort((a,b)=> a-b)
        console.log(`Part 1 answer is ${(Math.abs(rows.at(-1)-rows[0]+1)*Math.abs(cols.at(-1)-cols[0]+1))-currPosition.length}`)
    }    
}

console.log(`Part 2 answer is ${noOfRounds+=1}`) // takes forever








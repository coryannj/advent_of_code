const fs = require('fs');
const input = fs.readFileSync('../day9input.txt',{ encoding: 'utf8', flag: 'r' });
const numRegex = new RegExp(/\d+/, 'g');

let lines = input.split(/[\r\n]+/).map((x)=>x.split('').map(Number))
//console.log(lines)
let rowLen = lines.length
let colLen = lines[0].length

let resultArr = []
let basinArr = []

for(i=0;i<rowLen;i++){
    for(j=0;j<colLen;j++){
        let val = lines[i][j]
        if (val === 0){
            resultArr.push(val+1)
            basinArr.push([i,j])
        } else {
            let next = [[i,j+1],[i,j-1],[i+1,j],[i-1,j]].filter(([r,c])=> 0<=r && r<rowLen && 0<=c &&c<colLen)
            let vals = next.map(([r,c])=>lines[r][c]).filter((x)=> x>val)
    
            if(next.length === vals.length){
                resultArr.push(val+1)
                basinArr.push([i,j])
            }
        }


    }
}

console.log(resultArr.reduce((acc,curr)=> acc+curr)) // Part 1 answer



let basinSizes = []
let seen = []

basinArr.forEach(([br,bc])=>{
    let lowPoint = lines[br][bc]+1
    //console.log('lowPoint is ',lowPoint,'br,bc',br,bc)
    let basin = new Set()

    let queue = [[br,bc+1],[br,bc-1],[br+1,bc],[br-1,bc]].filter(([r,c])=>0<=r && r<rowLen && 0<=c &&c<colLen && !seen.includes(`${r}-${c}`) && lines[r][c]>=lowPoint && lines[r][c] !== 9)
    //console.log('queue is ',queue)
    while(queue.length>0){
        let nextQueue = []
        queue.forEach(([r,c])=>{
            basin.add(`${r}-${c}`)
            seen.push(`${r}-${c}`)
            let currVal = lines[r][c]+1
            let nextPoints = [[r,c+1],[r,c-1],[r+1,c],[r-1,c]].filter(([nr,nc])=>0<=nr && nr<rowLen && 0<=nc &&nc<colLen && !seen.includes(`${nr}-${nc}`) && lines[nr][nc]>=currVal && lines[nr][nc] !== 9)
            nextPoints.forEach((point)=>nextQueue.push(point))
        })
        //console.log('nextQueue is',nextQueue)
        queue = nextQueue
    }
    //console.log('basin is ',basin)
    if(basin.size>0){
        basinSizes.push(basin.size+1)
    }
})

basinSizes.sort((a,b)=>b-a)
console.log(basinSizes)

console.log(basinSizes.slice(0,3).reduce((acc,curr)=>acc*curr,1))
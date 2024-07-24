const fs = require('fs');
const input = fs.readFileSync('../day13input.txt',{ encoding: 'utf8', flag: 'r' });

let instructions = input.split(/\n\n/)

let lines = instructions[0].split(/[\r\n]+/).map((x)=>x.split(',').map(Number)).map((x)=>[x[1],x[0]]).sort((a,b)=>{
    if(a[0]===b[0]){
        return a[1]-b[1]
    } else {
        return a[0]-b[0]
    }
})

let folds = instructions[1].split(/[\r\n]+/).map((x)=>x.split('=')).map((x)=>[x[0].slice(-1),parseInt(x[1])])

let toFold = lines.slice()
let counter = 0

while(folds.length>0){
    counter++
    let nextFold = folds.shift()
    let aboveFold,belowFold

    if(nextFold[0]==='x'){
        aboveFold = toFold.filter(([r,c])=>c<nextFold[1])
        belowFold = toFold.filter(([r,c])=>c>nextFold[1]).map(([nr,nc])=>[nr,nc-((nc-nextFold[1])*2)])

    } else {
        aboveFold = toFold.filter(([r,c])=>r<nextFold[1])
        belowFold = toFold.filter(([r,c])=>r>nextFold[1]).map(([nr,nc])=>[nr-((nr-nextFold[1])*2),nc])
    }

    belowFold.forEach(([br,bc])=> {
        if(aboveFold.findIndex(([ar,ac])=>ar ===br && ac === bc) === -1){
            aboveFold.push([br,bc])
        }
    })

    toFold = aboveFold
    if(counter === 1){
        console.log('Part 1 answer is ',toFold.length)
    }
}

let tmaxRow = toFold.map((x)=>x[0]).sort((a,b)=>a-b).at(-1)
let tmaxCol = toFold.map((x)=>x[1]).sort((a,b)=>a-b).at(-1)

let row = Array(tmaxCol+1).fill(' ')
let grid = []

for(i=0;i<tmaxRow+1;i++){
    grid.push(row.slice())
}

toFold.forEach(([r,c])=>grid[r][c]='#')

grid.forEach((grow)=>console.log(grow.join(''))) // Part 2 answer

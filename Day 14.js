const fs = require('fs');
const input = fs.readFileSync('../day14input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/[\r\n]+/).map((x)=>x.split(' -> ').map((y)=>y.split(',').map(Number))).flatMap((x)=>x.flatMap((y,yx,yarr)=>yarr[yx+1] !== undefined ? [[y,yarr[yx+1]]]:[])).map((x)=>x.sort((a,b)=>{
    if(a[0]===b[0]){
        return a[1]-b[1]
    } else {
        return a[0]-b[0]
    }
}))

let paths = {}

lines.forEach(([[c1,r1],[c2,r2]])=>{
    if(c1 === c2){
        if(paths[c1]===undefined){
            paths[c1]=[]
        }

        while(r1<=r2){
            if(!paths[c1].includes(r1)){
                paths[c1].push(r1)
            }
            r1++
        }

    } else {

        while(c1<=c2){
            if(paths[c1]===undefined){
                paths[c1]=[]
            }
            if(!paths[c1].includes(r1)){
                paths[c1].push(r1)
            }
            c1++
        }
    }

})

Object.keys(paths).forEach((x)=>{
    paths[x].sort((a,b)=>a-b)
})

let resetPaths = JSON.stringify(paths)
let allCols = [...new Set(Object.keys(paths).map(Number))].sort((a,b)=>a-b)
let allRows = [...new Set(Object.values(paths).flat())].sort((a,b)=>a-b)
let [minCol,maxCol,minRow,maxRow] = [allCols[0],allCols.at(-1),0,allRows.at(-1)]
let floor = maxRow+1

function falls(col,row){
    if(row === floor){
        return [true,true,true]
    } else {
        return [paths[col].includes(row+1),
        paths[col-1] !== undefined && paths[col-1].includes(row+1),paths[col+1] !== undefined && paths[col+1].includes(row+1)]
    }
}

// Part 1
let col = 500
let row = paths[col][0]-1
let p1Counter = 0

while (col>=minCol &&col<=maxCol && row<=maxRow){
    let next = falls(col,row)

    if(next.every((x)=>x===true)){
        p1Counter++
        if(row<paths[col][0]){
            paths[col].unshift(row)
        } else {
            let insertInd = paths[col].findLastIndex((x)=>x<row)
            paths[col].splice(insertInd+1,0,row)
        }

        col = 500
        row = paths[col][0]-1
    } else {
        if(next[0]===false){
            row+=1
            continue
        }

        if(next[1]===false){
            col-=1
            row+=1
            continue
        }
        if(next[2]===false){
            col+=1
            row+=1
            continue
        }
    }
}
console.log(p1Counter) // Part 1 answer

// Part 2
paths = JSON.parse(resetPaths)
col = 500
row = paths[col][0]-1
let p2Counter = 0

while(row >= 0){
    let next = falls(col,row)

    if(next.every((x)=>x===true)){
        p2Counter++
        if(paths[col]===undefined){
            paths[col] = [row]
        } else {
            if(row<paths[col][0]){
                paths[col].unshift(row)
            } else {
                let insertInd = paths[col].findLastIndex((x)=>x<row)
                paths[col].splice(insertInd+1,0,row)
            }
        }

        col = 500
        row = paths[col][0]-1
    } else {
        if(next[0]===false){
            row+=1
            continue
        }

        if(next[1]===false){
            col-=1
            row+=1
            continue
        }
        if(next[2]===false){
            col+=1
            row+=1
            continue
        }
    }
}

console.log(p2Counter) // Part 2 answer

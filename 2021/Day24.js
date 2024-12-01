const fs = require('fs');
const input = fs.readFileSync('../day24input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/(?=inp)/gm).map((x)=>x.trim().split(/[\r\n]+/).map((y)=>y.split(' ').map((w,wx)=>wx>1?Number(w):w)))

let instructions = lines.slice().map((x)=>[x[5][2],x[15][2]])

let seen = []
let result = new Map()

while(instructions.findIndex((x,ix)=>!seen.includes(ix))!== -1){
    let getindex = instructions.findIndex((x,ix)=>!seen.includes(ix))
    let getoppindex = instructions[getindex+1][0]>0 ?instructions.findLastIndex((x,ix)=> x[0]<1 && !seen.includes(ix)) : getindex+1

        let index = instructions[getindex]
        let oppindex = instructions[getoppindex]

        let diff = Math.abs(index[1]+oppindex[0])            
        
        if(index[1]>Math.abs(oppindex[0])){
            result.set(getindex,[1,9-diff])
            result.set(getoppindex,[1+diff,9])
        } else {
            result.set(getoppindex, [1,9-diff])
            result.set(getindex, [1+diff,9])
        }
        seen.push(getindex)
        seen.push(getoppindex)

}

let resultSort = [...result.entries()].sort((a,b)=>a[0]-b[0])

console.log(resultSort.map((x)=>x[1][1]).join('')) // Part 1 answer
console.log(resultSort.map((x)=>x[1][0]).join('')) // Part 2 answer
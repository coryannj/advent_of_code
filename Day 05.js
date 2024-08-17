const fs = require('fs');
const input = fs.readFileSync('../day5input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=> [x.slice(0,7).split(''),x.slice(7).split('')])

function findSeat(roworcol,arr){
    let num = roworcol === 'row' ? 128 : 8
    let all = Array(num).fill('.').map((x,i)=>i)
    let dirs = structuredClone(arr)
    let len = all.length
    
    while(all.length>1 && dirs.length>0){
        let nextDir = dirs.shift()

        if(nextDir === 'F'||nextDir === 'L'){
            all = all.slice(0,len/2)
            len = all.length
        } else {
            all = all.slice(len/2)
            len = all.length
        }
    }
    return all.at(0)
}

let seatIds = lines.map(([r,c])=> (findSeat('row',r)*8)+findSeat('col',c)).sort((a,b)=> b-a)

console.log(seatIds.at(0)) // Part 1 answer

console.log(seatIds.find((x,ix,arr)=> ix>=0 && ix<arr.length-1 && arr[ix+1] !== x-1)-1) // Part 2 answer
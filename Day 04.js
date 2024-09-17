const fs = require('fs');
//const input = fs.readFileSync('../day2input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = '256310-732736'.split('-').map(Number)

let range = Array(lines[1]-lines[0]+1).fill('.').map((x,i)=>lines[0]+i)

console.log(range.filter((x)=>{
    let split = x.toString().split('').map(Number)
    return split.some((y,yx,arr)=>y === arr[yx+1]) && split.every((z,zx,zarr)=>z<=zarr[zx+1]||zx === 5)
}).length)

console.log(range.filter((x)=>{
    let split = x.toString().split('').map(Number)
    return split.some((y,yx,arr)=> (yx === 0 || y !== arr[yx-1])&& y === arr[yx+1] && (yx === 4 || y !== arr[yx+2])) && split.every((z,zx,zarr)=>z<=zarr[zx+1]||zx === 5)
}).length)
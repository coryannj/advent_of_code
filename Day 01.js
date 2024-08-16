const fs = require('fs');
const input = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map(Number)

console.log(lines.filter((x,ix,arr)=> arr.includes(2020-x)).reduce((acc,curr)=>acc*curr,1)) // Part 1

console.log(lines.filter((x,ix,arr)=>{
    let remainder = 2020-x
    let notx = arr.filter((y,yix)=> yix !== ix)
    let addToRemainder = notx.filter((z,zx,zarr)=>zarr.includes(remainder-z))
    if(addToRemainder.length>0){
        return true
    } else {
        return false
    }
}).reduce((acc,curr)=>acc*curr,1)) // Part 2


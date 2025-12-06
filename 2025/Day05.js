const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day5.txt', {encoding: "utf8", flag: "r", });

let [ranges,ids] = input.split(/\n\n/).map((x,i)=> i === 0 ? x.split(/\n/).map((y)=>y.split('-').map(Number)).sort((a,b)=> a[0]===b[0] ? b[1]-a[1] : a[0]-b[0]) : x.split(/\n/).map(Number))

const mergeSortedRanges = (arr,[x2,y2]) => {
    if(y2 <= arr.at(-1)[1]) return arr;

    return x2 > arr.at(-1)[1] ? arr.concat([[x2,y2]]) : arr.with(-1,[arr.at(-1)[0],y2])
}

let p1 = ids.filter((x)=> ranges.some(([s,e])=> x >= s && x <= e)).length

let p2 = ranges
            .reduce((a,c)=> mergeSortedRanges(a,c),[ranges.shift()])
            .reduce((a,c)=> a + (c[1]-c[0]+1), 0)

console.log('Part 1 answer is ', p1)
console.log('Part 2 answer is ', p2)
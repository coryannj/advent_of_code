const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day20.txt', {encoding: "utf8", flag: "r", });

let ranges = input.split(/\n/).map((x)=>x.split('-').map(Number)).sort(([x1,y1],[x2,y2])=> x1 === x2 ? y1-y2 : x1-x2)

const mergeSortedRanges = (arr,[x2,y2]) => {
    if(y2 <= arr.at(-1)[1]) return arr;
    return x2 > arr.at(-1)[1]+1 ? arr.concat([[x2,y2]]) : arr.with(-1,[arr.at(-1)[0],y2])
}

ranges = ranges.reduce((a,c)=> mergeSortedRanges(a,c),[ranges.shift()])

console.log(ranges[0][1]+1) // Part 1
console.log(4294967296-ranges.reduce((a,[x1,y1])=>a+(y1-x1+1),0)) // Part 2
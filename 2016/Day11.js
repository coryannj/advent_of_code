const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2016/day11.txt', {encoding: "utf8", flag: "r", });

let components = input.replaceAll('-compatible','').split(/\n/g).map((x)=>x.match(/(\w+ generator|\w+ microchip)/g)||[])


let elements = new Set(components.flatMap((x)=> x.length === 0 ? [] : x.map((y)=>y.split(' ')[0])))
console.log(elements)

let state = [...elements].map((x)=>components.flatMap((y,yi)=> y.length>0 && y.includes(x+' generator') ? [yi] : []).concat(components.flatMap((y,yi)=> y.length>0 && y.includes(x+' microchip') ? [yi] : []))).sort((a,b)=>a[0]===b[0] ? a[1]-b[1] : a[0]-b[0])
console.log(state)
const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2019/day10.txt', {encoding: "utf8", flag: "r", })

let asteroids = input.split(/\n/g).map((x)=>x.split('')).flatMap((x,xi)=>x.flatMap((y,yi)=> y === '#' ? [[xi,yi]]:[]))
let max = 0
let maxAsteroids

asteroids.forEach(([r,c],i)=>{
    let allNeighbours = asteroids.filter((y,yi)=>yi!==i).map(([nr,nc])=>[[nr,nc],Math.atan2(nr-r,nc-c)])

    let neighbours = new Set(allNeighbours.map((x)=>x[1]))

    if(neighbours.size>max){
        max=neighbours.size
        maxAsteroids = allNeighbours
    }
})

console.log(max) // Part 1

let yInd = maxAsteroids.sort((a,b)=>a[1]-b[1]).findIndex(([[nr,nc],angle]) => angle === Math.atan2(-1,0))

maxAsteroids = maxAsteroids.slice(yInd).concat(maxAsteroids.slice(0,yInd))

let [p2y,p2x] = maxAsteroids.find(([pos,angle])=> angle === [...new Set(maxAsteroids.map((x)=>x[1]))][199])[0] // There were >200 unique angles so don't need to loop through

console.log(p2x*100+p2y) // Part 2
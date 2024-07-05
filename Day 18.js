const fs = require('fs');
const input = fs.readFileSync('../day18input.txt',{ encoding: 'utf8' });

let cubes = input.split(/[\r\n]+/).map((x)=> x.split(',').map(Number)).sort((a,b)=>a[2]-b[2])

// Part 1
let surfaceArea = 0

for(i=0;i<cubes.length;i++){
    let thisCube = cubes[i]
    let touching = cubes.filter((x,ix)=> {
        let oneMore = x.filter((y,yix,arr)=>Math.abs(arr[yix]-thisCube[yix])===1)
        let same = x.filter((z,zix,zarr)=> thisCube[zix]=== zarr[zix])
        return same.length === 2 && oneMore.length === 1
    })

    surfaceArea += (6-touching.length)
}

console.log(surfaceArea) // Part 1 area


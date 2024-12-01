const fs = require('fs');
const input = fs.readFileSync('../day18input.txt',{ encoding: 'utf8' });

let cubes = input.split(/[\r\n]+/).map((x)=> x.split(',').map(Number)).sort((a,b)=>a[2]-b[2]).map(([x,y,z])=> [x+1,y+1,z+1])

let cubeKeys = cubes.map((x)=>x.join('-'))

let allx = cubes.map((x)=>x[0])
let ally = cubes.map((x)=>x[1])

let maxx = Math.max(...allx)
let maxy = Math.max(...ally)
let maxz = cubes.at(-1)[2]

let airCubes = {}

// Part 1
let surfaceArea = 0

for(i=0;i<cubes.length;i++){
    let thisCube = cubes[i]
    let [x,y,z] = thisCube

    let touching = cubes.filter((x,ix)=> {
        let oneMore = x.filter((y,yix,arr)=>Math.abs(arr[yix]-thisCube[yix])===1)
        let same = x.filter((z,zix,zarr)=> thisCube[zix]=== zarr[zix])
        return same.length === 2 && oneMore.length === 1
    }).map((x)=> x.join('-'))

    let air = [[x,y,z-1],[x,y,z+1],[x-1,y,z],[x+1,y,z],[x,y-1,z],[x,y+1,z]].map((x)=> x.join('-')).filter((y)=> !touching.includes(y))

    air.forEach((airCube)=>{ // For Part 2 - store what cubes are seen by each exposed side
            if (airCubes[airCube] === undefined) {
                airCubes[airCube] = []
            }
            airCubes[airCube].push(thisCube.join('-'))
    })

    surfaceArea += (6-touching.length)
}

console.log(surfaceArea) // Part 1 area

function bfs(coOrd){
    let queue = [coOrd]
    let seen = [`${coOrd[0]}-${coOrd[1]}-${coOrd[2]}`]
    let airSides = 0

    while(queue.length>0){
        let [x,y,z] = queue.shift()

        let nextCoords = [[x,y,z-1],[x,y,z+1],[x-1,y,z],[x+1,y,z],[x,y-1,z],[x,y+1,z]].filter(([a,b,c])=> !seen.includes(`${a}-${b}-${c}`) && !cubeKeys.includes(`${a}-${b}-${c}`) && 0 <= a && a <= maxx+1 && 0 <= b && b <= maxy+1 && 0 <= c && c <= maxz+1).map((z)=>z.join('-'))

        if(nextCoords.length>0){
            nextCoords.forEach((nextXYZ)=>{
                if(airCubes[nextXYZ] !== undefined){
                    airSides += airCubes[nextXYZ].length
                }
                seen.push(nextXYZ)
                queue.push(nextXYZ.split('-').map(Number))
            })
        }
    }

    return airSides
}
console.log(bfs([0,0,0])) // Part 2 answer

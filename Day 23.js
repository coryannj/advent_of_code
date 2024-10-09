const fs = require('fs');
const input = fs.readFileSync('../day23input.txt',{ encoding: 'utf8', flag: 'r' });
const numRegex = /([-]{0,1}\d+)/g

let lines = input.split(/[\r\n]+/).map((x)=>x.match(numRegex).map(Number))

let linesLen = lines.length

// Part 1
function testOverlap(point1,point2){
    let [x1,y1,z1,r1] = point1
    let [x2,y2,z2,r2] = point2

    let overlap = Math.abs(x2-x1)+Math.abs(y2-y1)+Math.abs(z2-z1)

    return [overlap<=r1,overlap]
}

let maxR = lines.map((x)=>x.at(-1)).sort((a,b)=>b-a)[0]
let maxCoord = lines.find((x)=>x.at(-1)===maxR)
let rest = lines.map((x)=>testOverlap(maxCoord,x)).filter((x)=>x[0]===true)
console.log(rest.length) // Part 1 answer

// Part 2

function manhattan(point1,point2){
    let [x1,y1,z1,r1] = point1
    let [x2,y2,z2,r2] = point2
    return Math.abs(x2-x1)+Math.abs(y2-y1)+Math.abs(z2-z1)
}
function* cartesian(head, ...tail) {
    const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
    for (let r of remainder) for (let h of head) yield [h, ...r];
}

function cubeRange([x1,x2,y1,y2,z1,z2],[nx1,ny1,nz1,nr1]){
    if(x1<=nx1 && nx1<=x2 && y1<=ny1 && ny1<=y2 && z1<=nz1 && nz1<=z2){
        return true
    } else {
        let xDist,yDist,zDist
        if(nx1<x1){
            xDist = Math.abs(x1-nx1)
        } else if (x1<=nx1 && nx1<=x2){
            xDist = 0
        } else {
            xDist = Math.abs(nx1-x2)
        }
        if(ny1<y1){
            yDist = Math.abs(y1-ny1)
        } else if (y1<=ny1 && ny1<=y2){
            yDist = 0
        } else {
            yDist = Math.abs(ny1-y2)
        }
        if(nz1<z1){
            zDist = Math.abs(z1-nz1)
        } else if (z1<=nz1 && nz1<=z2){
            zDist = 0
        } else {
            zDist = Math.abs(nz1-z2)
        }

        return (xDist+yDist+zDist)<=nr1
    }
}

function makeIntervals(x,ix,arr){
        if(ix === arr.length-1){
            return []
        } else if (ix === arr.length-2){
            return [[x,arr[ix+1]]]
        } else {
            return [[x,arr[ix+1]-1]]
        }
}
function makeRange(start,stop,steps){
    if((stop-start)<(steps*3)){
        return Array(stop-start+3).fill('.').map((x,ix)=>start+ix).flatMap((x,ix,arr)=>makeIntervals(x,ix,arr)).slice(0,-1)
    } else {
        return Array(steps).fill('.').map((x,ix)=>start+Math.floor(ix*((stop-start)/steps))).concat(stop).flatMap((x,ix,arr)=>makeIntervals(x,ix,arr))
    }
}

function squares([x1,x2,y1,y2,z1,z2]){
    let intervals = 10
    let xPairs = makeRange(x1,x2,intervals)
    let yPairs = makeRange(y1,y2,intervals)
    let zPairs = makeRange(z1,z2,intervals)

    return [...cartesian(xPairs,yPairs,zPairs)].map((vx)=>vx.flat())
}

let maxmin = lines.map(([x,y,z,r])=>[[x-r,x+r],[y-r,y+r],[z-r,z+r]])
let allX = maxmin.flatMap((x)=>x[0]).sort((a,b)=>a-b)
let allY = maxmin.flatMap((x)=>x[1]).sort((a,b)=>a-b)
let allZ = maxmin.flatMap((x)=>x[2]).sort((a,b)=>a-b)

let queue = Array(linesLen+100).fill('.').map((x,ix)=>[])
queue[0].push([allX[0],allX.at(-1),allY[0],allY.at(-1),allZ[0],allZ.at(-1)])

let p2maxOverlap = 0
let p2maxInd
let p2maxCube

while(queue.findIndex((x)=>x.length>0) !== -1){
    let split = squares(queue[queue.findIndex((x)=>x.length>0)].shift())

    split.forEach((cube,ix)=>{

        let overlap = lines.filter((x)=>cubeRange(cube,x)===true)

        if(cube[0]===cube[1]&&cube[2]===cube[3]&&cube[4]===cube[5]){
            if(overlap.length>p2maxOverlap){
                p2maxOverlap = overlap.length
                p2maxInd = ix
                p2maxCube = cube
            }

        }else {
            if(overlap.length>980){
                queue[linesLen-overlap.length].push(cube)
            }
        }
    })
}

console.log(manhattan([p2maxCube[0],p2maxCube[2],p2maxCube[4],0],[0,0,0,0])) //Part 2 answer


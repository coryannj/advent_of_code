const fs = require("fs");
require("../utils.js");
const { shoelace, md5, gcd, lcm, nextArr, nextArr8 } = require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day12.txt', {encoding: "utf8", flag: "r", });

// Helper functions
const rcToNum = ([r,c],factor) => (r*factor)+c
const NumToRC = (num,factor) => {
    if(num<factor) return [0,num]
    return [(num-(num%factor))/factor,num%factor]
    }
const getNumRC = (num,grid) => {
    let c = num%factor
    let r = (num-c)/factor
    return grid[r][c]
}
const rcStep = (num,factor,[nr,nc]) => {
    let r,c
    if (num<factor){
        r = 0,c = num
    } else {
        c = num%factor
        r = (num-c)/factor
    }

    return rcToNum([r+nr,c+nc],factor)
}

const sides = (convex,concave) => {
    if(concave.length === 0){
        return convex.length
    } else {
        let interiorAngles = convex.map((x)=>90).sum() + concave.map((x)=>270).sum();
        return (interiorAngles/180)+2
    }
}

// Pad grid to avoid bounds checking
let grid = input.lines().map((x)=>'.'+x+'.')
let newRowLen = grid[0].length
let boundsRow = Array(newRowLen).fill('.').join('')
grid.unshift(boundsRow)
grid.push(boundsRow)
let rowLen = grid.length
let colLen = grid[0].length
let factor = 10

while(factor<colLen){
    factor*=10
}

grid = grid.mk2d().map((x,ix)=>x.map((y,yx)=>[rcToNum([ix,yx],factor),y]))

// Build region list
let seen = new Set()
let regions = []
let queue = grid.flat().filter((x)=>x[1] !== '.')

let p1 = 0
let p2 = 0
let regionIndex = 0

while(queue.length>0){
    let [coOrd,val] = queue.shift()
    
    if(seen.has(coOrd)) continue;
    seen.add(coOrd)

    let start = [coOrd,'U']
    let next = start
    let region = []
    let border = []
    let inner = [] // inner region
    let convex = [] // outside corner
    let concave = [] // outside corner

    do{
        let [point,dir] = next
        region.push(point)
        border.push(point)
        seen.add(point)
        let dirs = 'URDL'
        let dirIdx = dirs.indexOf(dir)
        let step = nextArr(point,factor,grid) 
        let stepVals = [U,R,D,L] = step.map((x)=>getNumRC(x,grid)[1])
        let outside = [[-1,-1],[-1,1],[1,1],[1,-1]].map(([nr,nc],ix)=>NumToRC(point,factor).map((y,yx)=>yx === 0 ? y+nr : y+nc)).map(([nr,nc])=>grid[nr][nc][1])
        
        if(stepVals[dirIdx] === val && outside[dirIdx] !== val){
            next = [step[dirIdx],dir]
        } else {
            // Must be a corner

            // Check for convex first
            let convexCheck = [[U,L],[U,R],[D,R],[D,L]]
            let convexPoint = [[-1,-1],[-1,1],[1,1],[1,-1]]

            if(convexCheck[dirIdx].every((x)=> x !== val)){
                next = [point,dirs[(dirIdx+1)%4]]
                let cornerPoint = NumToRC(point,factor).map((x,ix)=>x+convexPoint[dirIdx][ix])
                convex.push(rcToNum(cornerPoint,factor))
            } else {
                // Must be concave
                let concavePoint = [[-1,-1],[-1,1],[1,1],[1,-1]]
                concave.push(step[(dirIdx+4-1)%4])
                next = [rcStep(point,factor,concavePoint[dirIdx]),dirs[(dirIdx+4-1)%4]]
            }
        }
    } while(next.some((x,ix)=>x!==start[ix]))

    const innerTest = ([tr,tc]) => !seen.has(rcToNum([tr,tc],factor)) && grid[tr][tc][1] === val
    let innerCheck = region.flatMap((x)=>nextArr(x,factor,grid,innerTest))

    while(innerCheck.length>0){
        region.push(...innerCheck)
        inner.push(...innerCheck)
        innerCheck.forEach((x)=>seen.add(x))
        innerCheck = innerCheck.flatMap((x)=>nextArr(x,factor,grid,innerTest))
    }

    let regionObj = {
        'regionIndex': regionIndex,
        'value': val,
        'region': [...new Set(region)],
        'inner': [...new Set(inner)],
        'border': border,
        'convex': convex,
        'concave': concave,
        'borderOffset':0,
        'sidesOffset':0

    }
    regions.push(regionObj)
    regionIndex++
}

let surroundedIndexes = []

// Process fully surrounded regions first
regions.forEach((x,ix,arr)=>{
    let sIndex = arr.findIndex((y)=>x.convex.filter((z)=>y.region.includes(z)).length>=x.convex.length-1)

    if(sIndex !== -1){
        surroundedIndexes.push(x.regionIndex);
        let p2Sides = sides(x.convex,x.concave);
        
        p1+=(x.border.length*x.region.length)
        p2+=(p2Sides*x.region.length)
        
        // If the surrounding region has no overlapping corners - we need to add this region's borders/sides to that region's offset
        if(!regions[sIndex]['convex'].concat(regions[sIndex]['concave']).some((y)=>x.region.includes(y))){
            regions[sIndex]['borderOffset']+=x.border.length
            regions[sIndex]['sidesOffset']+=p2Sides
        }
    }
})

regions.filter((x,ix)=>!surroundedIndexes.includes(ix)).forEach((x)=>{
    let p2Sides = sides(x.convex,x.concave);
    
    p1+=((x.border.length+x.borderOffset)*x.region.length);
    p2+=((p2Sides+x.sidesOffset)*x.region.length);
})

console.log('p1 ',p1,' p2 ',p2)
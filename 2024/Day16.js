const fs = require("fs");
require("../utils.js");
const { shoelace, md5, gcd, lcm, nextArr, nextArr8 } = require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day16.txt', {encoding: "utf8", flag: "r", });

let grid = input.lines().mk2d();
let startR = grid.findIndex((x)=>x.includes('S'));
let startC = grid[startR].indexOf('S');
let endR = grid.findIndex((x)=>x.includes('E'));
let endC = grid[endR].indexOf('E');
let rowLen = grid.length
let colLen = grid[0].length
let rowFactor = 1
let colFactor = 1

while(rowFactor<=colFactor*colLen){
    rowFactor*=10
}

// Helper functions
const rcToNum = (r,c) => (r*rowFactor)+(c*colFactor)
const numToRC = (num) => {
    if(num<rowFactor) return [0,num]
    return [(num-(num%rowFactor))/rowFactor,num%rowFactor]
}
const getNum = (num) => {
    let c = num%rowFactor
    let r = (num-c)/rowFactor
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

let gridMap = new Map(grid.flatMap((x,ix)=>x.map((y,yx)=>[rcToNum(ix,yx),y])).filter(([k,v])=>'.SE'.includes(v)))
console.log([...gridMap.keys()].slice(-100))

console.log([...gridMap.keys()].filter((x)=>gridMap.get(x) === 'S'||gridMap.get(x)==='E'))
console.log(rcToNum(startR,startC),rcToNum(endR,endC))

let start = rcToNum(startR,startC)
let end = rcToNum(endR,endC)

console.log(rcToNum(-1,1),rcToNum(-1,0))

let distVal = {
    U:1000000,
    R:2000000,
    D:3000000,
    L:4000000
}

// {score,seen,prev,last,currDir}
// colfactor +/-
// rowfactor +/-













let queue = Array(2000).fill('.').map((x)=>[])
queue[0].push([0,[[startR,startC,'R']]])

let p1min = 99999999
let p2 = []

let distObj = Object.fromEntries(grid.flatMap((x,ix)=>x.flatMap((y,yx)=>['U','D','L','R'].map((z)=>[`${ix}|${yx}|${z}`,999999]))))

let nextObj = {}
let cacheHits = 0
const nextStep = ([sr,sc,dir]) => {
    if(nextObj[[sr,sc,dir].join('|')] !== undefined){
        cacheHits++
        return nextObj[[sr,sc,dir].join('|')]
    } 

    let backwards = {U:'D',D:'U',L:'R',R:'L'}
    
    let next = [[sr-1,sc,'U'],[sr,sc+1,'R'],[sr+1,sc,'D'],[sr,sc-1,'L']].filter(([nr,nc,nd])=>grid[nr][nc] !== '#' && nd !== backwards[dir])
    nextObj[[sr,sc,dir].join('|')] = next
    
    return next
}


let t0=performance.now()

while(queue.some((x)=>x.length>0)){

    let [score,path] = queue[queue.findIndex((x)=>x.length>0)].shift()
    let last = [lr,lc,ld] = path.at(-1)
    
    if(score>distObj[[lr,lc,ld].join('|')]){
        continue;
    } 
    
    distObj[[lr,lc,ld].join('|')] = score

    let steps = nextStep(last).filter((x)=>!path.some((y)=>y.slice(0,2).join('|') === x.slice(0,2).join('|')))

    steps.forEach(([nr,nc,nd])=>{
        let newPath = path.slice()
        newPath.push([nr,nc,nd])
        let newScore = nd === ld ? score+1 : score+1001

        if(newScore<=p1min){
            if(nr === endR && nc === endC){
                p1min = newScore
                p2.push([newScore,newPath])
            } else {
                queue[Math.floor(newScore/100)].push([newScore,newPath])
            }
        }
    })
}
let t1=performance.now()
let allP2MinPaths = new Set(p2.filter((x)=>x[0]===p1min).flatMap((x)=>x[1]).map((x)=>x.slice(0,2).join('|')))
let t2 = performance.now()
console.log('P1 answer is ',p1min,t1-t0,' P2 answer is ',allP2MinPaths.size,t2-t1,t2-t0)
console.log(cacheHits)
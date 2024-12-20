const fs = require("fs");
require("../utils.js");
const {MinQueue} = require("heapify");
const input = fs.readFileSync('../inputs/2024/day20.txt', {encoding: "utf8", flag: "r", });

let grid = input.lines().mk2d();
let startR = grid.findIndex((x)=>x.includes('S'));
let startC = grid[startR].indexOf('S');
let endR = grid.findIndex((x)=>x.includes('E'));
let endC = grid[endR].indexOf('E');
let rowLen = grid.length
let colLen = grid[0].length

grid[startR][startC] = '.'
grid[endR][endC] = '.'

grid = grid.map((x,ix)=>x.map((y,yx)=>[ix,yx,y]))
gridVals = grid.flat()

const nextStep = ([sr,sc,dir]) => {
    return [[sr-1,sc,'U'],[sr,sc+1,'R'],[sr+1,sc,'D'],[sr,sc-1,'L']].filter(([nr,nc,nd])=>grid?.[nr]?.[nc] !== undefined && grid?.[nr]?.[nc]?.[2] === '.')
}

let cheats = gridVals.flatMap((x)=>{
    let adj = nextStep(x).filter(([nr,nc,nd])=>grid[nr][nc][2]==='.')
    let adjDirs = adj.map((x)=>x[2])
    let oppDirs = {U:'D',D:'U',L:'R',R:'L'}

    let adjObj = []

    if(adj.length>0){
        adj.forEach(([ar,ac,ad])=>{
            let opposite = oppDirs[ad]
            if(adj.some(([r,c,d])=> d === opposite)){
                adjObj.push([ar,ac].join('|'))
            }
        })
    }

    return x[2] === '#' && adj.length>0 && ((adjDirs.includes('U') && adjDirs.includes('D'))||(adjDirs.includes('R') && adjDirs.includes('L'))) ? [[x,adjObj]] : []
})

let shortestPath = []

// Part 1
const findShortest = ()=>{
    
    let queue = Array(10000).fill('.').map((x)=>[])
    queue[0].push([0,[[startR,startC,'R']]])
    let p1min = 99999999

    let distObj = Object.fromEntries(grid.flatMap((x,ix)=>x.flatMap((y,yx)=>['U','D','L','R'].map((z)=>[`${ix}|${yx}|${z}`,999999]))))

    while(p1min === 99999999 && queue.some((x)=>x.length>0)){

        let [score,path] = queue[queue.findIndex((x)=>x.length>0)].shift()
        let last = [lr,lc,ld] = path.at(-1)
        //console.log(score,path)
        if(score>distObj[[lr,lc,ld].join('|')]){
            continue;
        } 
        
        distObj[[lr,lc,ld].join('|')] = score

        let steps = nextStep(last).filter((x)=>!path.some((y)=>y.slice(0,2).join('|') === x.slice(0,2).join('|')))

        steps.forEach(([nr,nc,nd])=>{
            let newPath = path.slice()
            newPath.push([nr,nc,nd])
            let newScore = score+1

            if(newScore<p1min){
                if(nr === endR && nc === endC){
                    p1min = newScore
                    shortestPath.push(newPath)                    
                } else {
                    if(newScore<distObj[[nr,nc,nd].join('|')]){
                        distObj[[nr,nc,nd].join('|')] = newScore
                        queue[newScore].push([newScore,newPath])
                    }
                }
            }
        })
    }

    return p1min
}
let t0 = performance.now()
let p1shortest = findShortest()
let stepMap = new Map(shortestPath[0].map(([r,c,d],ix)=>[`${r}|${c}`,ix]))
let p1cheats = 0


cheats.forEach(([point,adj])=>{
    let pathIndex = adj.map((x)=>stepMap.get(x))
    let diff = Math.abs(pathIndex[0]-pathIndex[1])-2

    if(diff>=100){
        p1cheats++
    }
})
let t1 = performance.now()
console.log('p1ans is ',p1cheats,t1-t0)

// Part 2
let plus100 = [...stepMap.keys()].slice(100)

const manhattanTest = (pointKey,pathKey) => {
    let [r1,c1] = pointKey.split('|').map(Number)
    let [r2,c2] = pathKey.split('|').map(Number)
    
    let manhattan = Math.abs(r1-r2)+Math.abs(c1-c2)

    if(manhattan>20){
        return false
    } 
    let pointStep = stepMap.get(pointKey)
    let pathStep = stepMap.get(pathKey)
    
    let originalDist = p1shortest-pointStep
    let newDist = (p1shortest-pathStep)+manhattan
    
    return (originalDist-newDist)>=100
}

let p2ans = 0

let t2 = performance.now()
for (const key of stepMap.keys()) {
    if(plus100.length ===0 )break;

    //console.log('key,value',key,value)


    let thisCheats = plus100.filter((x)=>manhattanTest(key,x))

   // console.log('thisCheats is ',thisCheats)
    p2ans+=thisCheats.length
  //  console.log('added ',thisCheats.length,' p2ans is now ',p2ans)

    plus100.shift()
}
let t3 = performance.now()

console.log('p2ans is ',p2ans,t3-t2)

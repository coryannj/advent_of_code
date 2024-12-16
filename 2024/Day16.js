const fs = require("fs");
require("../utils.js");
const { shoelace, md5, gcd, lcm, nextArr, nextArr8 } = require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day16.txt', {encoding: "utf8", flag: "r", });

let grid = input.lines().mk2d();
let startR = grid.findIndex((x)=>x.includes('S'));
let startC = grid[startR].indexOf('S');
let endR = grid.findIndex((x)=>x.includes('E'));
let endC = grid[endR].indexOf('E');

const nextStep = ([sr,sc,dir]) => {
    let backwards = {U:'D',D:'U',L:'R',R:'L'}
    return [[sr-1,sc,'U'],[sr,sc+1,'R'],[sr+1,sc,'D'],[sr,sc-1,'L']].filter(([nr,nc,nd])=>grid[nr][nc] !== '#' && nd !== backwards[dir])
}

let queue = Array(2000).fill('.').map((x)=>[])
queue[0].push([0,[[startR,startC,'R']]])

let p1min = 99999999
let p2 = []

let distObj = Object.fromEntries(grid.flatMap((x,ix)=>x.flatMap((y,yx)=>['U','D','L','R'].map((z)=>[`${ix}|${yx}|${z}`,999999]))))

while(queue.some((x)=>x.length>0)){

    let [score,path] = queue[queue.findIndex((x)=>x.length>0)].shift()
    let last = [lr,lc,ld] = path.at(-1)
    
    if(score>distObj[[lr,lc,ld].join('|')]){
        continue;
    } 
    
    distObj[[lr,lc,ld].join('|')] = score

    let steps = nextStep(last).filter((x)=>!path.some((y)=>y.slice(0,2).join('|') === x.slice(0,2).join('|')))

    if(steps.some(([sr,sc,sd])=>sr === endR && sc === endC)){
        let laststep = steps.find((x)=>x[0]===endR && x[1] === endC)
        let newEnd = []
        if (ld === laststep[2]){
            newEnd.push(score+1)
            newEnd.push(path)
            newEnd[1].push(laststep)
        } else {
            newEnd.push(score+1001)
            newEnd.push(path)
            newEnd[1].push(laststep)
        }

        if(newEnd[0]<=p1min){
            p1min = newEnd[0]
            p2.push(newEnd)
        }
    }

    steps.forEach(([nr,nc,nd])=>{
        let newPath = path.slice()
        newPath.push([nr,nc,nd])
        let newScore = nd === ld ? score+1 : score+1001

        if(newScore<p1min){
            queue[Math.floor(newScore/100)].push([newScore,newPath])
        }
    })
}

let allP2MinPaths = new Set(p2.filter((x)=>x[0]===p1min).flatMap((x)=>x[1]).map((x)=>x.slice(0,2).join('|')))

console.log('P1 answer is ',p1min,' P2 answer is ',allP2MinPaths.size)
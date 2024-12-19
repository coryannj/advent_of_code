const fs = require("fs");
require("../utils.js");
const { shoelace, md5, gcd, lcm, nextArr, nextArr8 } = require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day18.txt', {encoding: "utf8", flag: "r", });

const bytes = input.lines().mk2d(',',1);
let gridLen = 71;
let [startR,startC,endR,endC] = [0,0,gridLen-1,gridLen-1];
const manhattanEnd = (nr,nc) => (endR-nr)+(endC-nc);
const grid = Array(gridLen).fill(0).map((x)=>Array(gridLen).fill(0).map((y)=>'.'))
let byteLen = 1024;

bytes.slice(0,byteLen).forEach(([c,r])=>grid[r][c] = '#')

const nextStep = ([sr,sc,dir]) => {
    return [[sr-1,sc,'U'],[sr,sc+1,'R'],[sr+1,sc,'D'],[sr,sc-1,'L']].filter(([nr,nc,nd])=>grid?.[nr]?.[nc] !== undefined && grid?.[nr]?.[nc] !== '#')
}

let deadEnds = grid.flatMap((x,ix)=>x.map((y,yx)=>[ix,yx])).filter(([nr,nc]) => [nr,nc].join('|') !== [startR,startC].join('|')&&[nr,nc].join('|') !== [endR,endC].join('|')&&grid[nr][nc] ==='.' && [nr,nc].step4(gridLen,gridLen).filter(([nr,nc])=>grid[nr]?.[nc]==='.').length === 1)

while (deadEnds.length>0){
    deadEnds.forEach(([dr,dc])=>{
        grid[dr][dc] = '#'
    })
    deadEnds = grid.flatMap((x,ix)=>x.map((y,yx)=>[ix,yx])).filter(([nr,nc]) => [nr,nc].join('|') !== [startR,startC].join('|')&&[nr,nc].join('|') !== [endR,endC].join('|')&&grid[nr][nc] ==='.' && [nr,nc].step4(gridLen,gridLen).filter(([nr,nc])=>grid[nr]?.[nc]==='.').length === 1)

}

// Part 1
const findShortest = ()=>{
    
    let queue = Array(2000).fill('.').map((x)=>[])
    queue[0].push([0,[[startR,startC,'R']]])
    let p1min = 99999999

    let distObj = Object.fromEntries(grid.flatMap((x,ix)=>x.flatMap((y,yx)=>['U','D','L','R'].map((z)=>[`${ix}|${yx}|${z}`,999999]))))

    while(p1min === 99999999 && queue.some((x)=>x.length>0)){

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
            let newScore = score+1

            if(newScore<p1min){
                if(nr === endR && nc === endC){
                    p1min = newScore                    
                } else {
                    if(newScore<distObj[[nr,nc,nd].join('|')]){
                        distObj[[nr,nc,nd].join('|')] = newScore
                        queue[newScore+manhattanEnd(nr,nc)].push([newScore,newPath])
                    }
                }
            }
        })
    }

    return p1min
}

console.log('P1 answer is ',findShortest())

// Part 2
let restBytes = bytes.slice(byteLen)

while(restBytes.length>0){
    let [bc,br] = restBytes.shift()

    if(grid[br][bc] === '#') {
        //console.log('dead end - can continue')
        continue;
    }
    
    grid[br][bc] = '#'
    let p1begin = 99999999
    
    let p2min = findShortest()
    
    if(p2min === p1begin){
        console.log('p2 answer is', [bc,br].join(','))
        break;
    }
}

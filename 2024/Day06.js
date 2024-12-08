const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('./inputs/2024/day6.txt', {encoding: "utf8", flag: "r", });

const a = input.split(/[\r\n]+/).map((x)=>x.split(''));
let b = structuredClone(a).map((x)=>x.map((y)=>y==='#'?y:0))

// Part 1
let startR = a.findIndex((x)=>x.includes('^'));
let startC = a[startR].indexOf('^');
a[startR][startC] = '.';
let start = [startR,startC,'U'];

let seenDirSet = new Set(), seenDir = [], seenDirObj = {},steps=0

const step = ([r,c,dir]) => {
    let nextObj = {
        'R':[r,c+1,'R'],
        'L':[r,c-1,'L'],
        'U':[r-1,c,'U'],
        'D':[r+1,c,'D'],
    }

    let turnObj =  {'R':'D','L':'U','U':'R','D':'L'}

    let nextrc = nextObj[dir]
    let nextVal = a[nextrc[0]]?.[nextrc[1]]

    if(!nextVal){
        //if(partNo ===2)console.log(coOrd,seen.size,seen.intersection(p1SeenDir).size)
        //uSet[coOrd.join('|')] ? ++uSet[coOrd.join('|')] : uSet[coOrd.join('|')] = 1
        return undefined
    } else {
        //let turn = 0,lastVal = coOrd
        while(nextVal === '#'){
            let newNext = nextObj[turnObj[nextrc[2]]]
            nextVal = a[newNext[0]][newNext[1]]
            nextrc = newNext
            //turn++
        }
        //if(turn>0)turns.push(lastVal)
        return nextrc
    }        
}

const walk = (coOrd,partNo,seenSet) => {
    let seen = seenSet ?? new Set()

    while(coOrd !== undefined){
        //b[coOrd[0]][coOrd[1]]++
        if(partNo===1){
            seen.add(coOrd.slice(0,2).join('|'))
            seenDirSet.add(coOrd.join('|'))
            seenDirObj[coOrd.join('|')] = steps
            seenDir.push(coOrd)
            steps++
        } else {
            if(seen.has(coOrd.join('|'))) break;
            seen.add(coOrd.join('|'))
        }
        //if(partNo===1) seenDir.push(coOrd)
        //if(partNo === 2 && 
        //partNo === 1 ? seen.add(coOrd.slice(0,2).join('|')) : seen.add(coOrd.join('|'))
        //seenDirSet.add(coOrd.join('|'))
        coOrd = step(coOrd);
    }
    //console.log('intersections size,loopcount',intersections.size,loopCount,coOrd)
    //if(coOrd === undefined)console.log(turns)
    if(coOrd === undefined){
        return partNo === 1 ? [seen.size,seen] : 0
    } else {
        return 1
    }
}




let [p1,p1path] = walk(start,1)
console.log(p1)
//console.log(seenDirObj)
console.log(seenDir.slice(0,10))
let p2Seen = new Set()

let onpath = 0
let notonpath = 0

for(i=0;i<seenDir.length-1;i++){
    let p2start = [sr,sc,sd] = seenDir[i]
    let obstacle = [or,oc,od] = seenDir[i+1]
    //let p2start = [sr,sc,sd] = [80,79,'U']
    //let obstacle = [or,oc,od] = [79,79,'U']
    let toObstacle = [[or,oc+1,'L'],[or,oc-1,'R'],[or-1,oc,'D'],[or+1,oc,'U']].filter((x)=> x.some((y,yx)=>y!==p2start[yx])).map((x)=>[x,x.join('|'),seenDirObj[x.join('|')]])
    
    if(toObstacle.some((x)=>x[2]!==undefined)){
        console.log(p2start,obstacle,toObstacle)
        onpath++
    } else {
        notonpath++
    }
    


   // p2Seen.add(p2start.join('|'))
    
    
}
console.log('on path',onpath,' not on path',notonpath)

//console.log(p1first.length,[...new Set(p1first)].length,p1first.slice(0,100))

//b.forEach((x)=>console.log(x.map((y)=>y===0 ? ' ':y).join('')))

//let p2path = p1path.difference(p1loops)
//console.log(p2path.size,p2path.has(start.slice(0,2).join('|')))








// Part 2
// p1path.delete(start.slice(0,2).join('|'))
// p2path.delete(start.slice(0,2).join('|'))
// let p2 = 0

// for(const item of p2path){
//     b = structuredClone(a).map((x)=>x.map((y)=>0))
//     let [r,c] = item.split('|').map(Number);
//     a[r][c] = '#';
//     let score = walk(start,2);

//     p2+=score
//     // if(score === 0){
//     //     b[r][c] = "X"
//     //     b.forEach((x)=>console.log(x.map((y)=>y===0 ? ' ':y).join('')))
//     // }

//     a[r][c] = '.';
// }

// console.log(p1,p2)
// Object.entries(uSet).sort2d(1).forEach((x)=>console.log(x))
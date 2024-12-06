const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('./inputs/2024/day6.txt', {encoding: "utf8", flag: "r", });

const a = input.lines().mk2d()
//let b = structuredClone(a)

let startR = a.findIndex((x)=>x.includes('^'))
let startC = a[startR].indexOf('^')
let [rowLen,colLen] = [a.length,a[0].length]

a[startR][startC] = '.'
let start = [startR,startC,'U']

const walk = (coOrd,partNo) => {
    let seen = new Set();
    //let turns = new Set();
    let steps = 0
    let loopCount = 0

    const step = ([r,c,dir]) => {
        let nextObj = {
            'R':[r,c+1,'R'],
            'L':[r,c-1,'L'],
            'U':[r-1,c,'U'],
            'D':[r+1,c,'D'],
        }

        let turnObj =  {'R':'D','L':'U','U':'R','D':'L'}

        let [nr,nc] = nextObj[dir]
        let nextVal = a[nr]?.[nc]

        if(!nextVal){
            return undefined
        } else if (nextVal === '#'){
            //turns.add(`${[r,c].join('|')}`)
            return nextObj[turnObj[dir]]
        } else {
            return nextObj[dir]
        }
        
    }

    while(coOrd !== undefined){
        //if(seen.has(coOrd.join('|'))) loopCount++;
        if(partNo === 2 && seen.has(coOrd.join('|'))) break;
        partNo === 1 ? seen.add(coOrd.slice(0,2).join('|')) : seen.add(coOrd.join('|'))


        coOrd = step(coOrd);
        
        steps++
    }
    
    if(coOrd === undefined){
        return partNo === 1 ? [seen.size,steps,seen] : 0
    } else {
        console.log(coOrd,steps,loopCount,seen.size)
        return 1
    }
}

//console.log(walk(start,1))

let [p1ans,p1steps,p1path] = walk(start,1)

console.log(p1ans)




let p2 = 0

for(i=0;i<rowLen;i++){
    for(j=0;j<colLen;j++){
        if((i===startR && j === startC) || a[i][j] === '#'){
            continue;
        } else {
            a[i][j] = '#'
            p2 += walk(start,2)

            a[i][j] = '.'
        }
    }
}


console.log(p2)
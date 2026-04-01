const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day24.txt', {encoding: "utf8", flag: "r", });

// Find shortest distance all pairs
let lines = input.split(/\n/).map((x)=>x.split(''))

const nextArr = (r,c) => [[r+1,c],[r-1,c],[r,c+1],[r,c-1]]

let
    poi = lines.flatMap((x,xi)=>x.flatMap((y,yi)=> y !== '.' && y!=='#' ? [[xi,yi,y]] :[])),
    pLen = poi.length,
    pKeys = Object.fromEntries(poi.map(([r,c,v])=>[`${r}_${c}`,v])),
    pDistances = Array(pLen).fill().map((x)=> Array(pLen).fill(-1).map((x)=>x)),
    pSeen = Object.fromEntries(poi.map(([r,c,v])=> [v,new Set([`${r}_${c}`])])),
    queue = poi.map(([r,c,v])=>[0,v,[r,c]])

const step = ([id,[r,c]]) => nextArr(r,c).filter(([nr,nc])=> lines[nr][nc] !== '#' && !pSeen[id].has(`${nr}_${nc}`))

while(queue.length){
    let last = [s,id,pos] = queue.shift()

    s++

    step(last.slice(1)).forEach((x)=>{
        let k = x.join('_')
        pSeen[id].add(k)
        if(pKeys[k]) pDistances[id][+pKeys[k]] = s
        if(pDistances[id].filter((x)=> x === -1).length>1) queue.push([s,id,x])
    })
}

// Find shortest
const solve = (partNo) => {
    let combos = Array(pLen).fill().map((x,i)=>i === 0 ? [0] : Array(pLen-1).fill().map((y,yi)=>yi+1))
    let minDist = Infinity

    function* cartesian(head, ...tail) {
        const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
        for (let r of remainder){
            for (let h of head){
                if(!r.length || !r.includes(h)){
                    if(r.length === pLen-1){
                        let path = [h, ...r]
                        let steps = path.map((x,i,a)=> i !== a.length-1 ? pDistances[x][a[i+1]] : 0).reduce((a,c)=>a+c)
                        let toStart = partNo === 1 ? 0 : pDistances[path.at(-1)][0]

                        if(steps+toStart<minDist){
                            yield steps+toStart
                        }
                    } else {
                        yield [h, ...r]
                    }
                }
            } 
        } ;
    }

    let allDistances = cartesian(...combos)
    let currDist = allDistances.next()

    do{
        minDist = currDist.value
        currDist = allDistances.next()
    } while(!currDist.done)
    
    return minDist
}

console.log(solve(1))
console.log(solve(2))
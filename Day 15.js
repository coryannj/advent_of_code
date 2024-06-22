const fs = require('fs');
const input = fs.readFileSync('../day15input.txt',{ encoding: 'utf8', flag: 'r' });

const parseRegex = /([-\d]+)/g
const lines = input.split(/[\r\n]+/).map((y)=>y.match(parseRegex).map((z)=> parseInt(z)))

function difference(a, b) {
    return Math.abs(a - b);
}

let sensorMap = []
let borderCorners = []
let beaconKeys = []
let sensorKeys = []

lines.forEach(([c1,r1,c2,r2])=> {
    let cdiff = difference(c1,c2);
    let rdiff = difference(r1,r2);
    let manhattan = cdiff+rdiff;

    sensorMap.push([[r1,c1],[r2,c2],[r1-manhattan,r1+manhattan],[c1-manhattan,c1+manhattan],manhattan]);
    borderCorners.push([[r1-manhattan-1,c1],[r1+manhattan+1,c1],[r1,c1-manhattan-1],[r1,c1+manhattan],[r1,c1],manhattan])
    beaconKeys.push(`${r2}_${c2}`);
    sensorKeys.push(`${r1}_${c1}`);
})

let allc = sensorMap.flatMap(([[r1,c1],[r2,c2],[r1min,r1max],[c1min,c1max],dist])=>[c1,c2,c1min,c1max])

let minc = Math.min(...allc),maxc = Math.max(...allc)

//Part 1

let noBeacon = 0;
let rowChkInd = 2000000;

for(i=minc;i<maxc;i++){    
    if(!!sensorMap.some(([[r1,c1],[r2,c2],[r1min,r1max],[c1min,c1max],dist])=> (difference(rowChkInd,r1)+difference(i,c1))<=dist && !beaconKeys.includes(`${rowChkInd}_${i}`))){
        noBeacon++
    }
}

console.log(noBeacon) // Part 1 answer

// Part 2
let seen = new Set()
let p2result = 0
let counter = 0

function getNextBorderPoint(br,bc,sr,sc,dist){
    return [[br-1,bc-1],[br-1,bc+1],[br+1,bc-1],[br+1,bc+1]].filter(([nbr,nbc])=>{
        let rdiff = difference(sr,nbr)
        let cdiff = difference(sc,nbc)
        return 0<=nbr && nbr <= 4000000 && 0<=nbc && nbc <= 4000000 && !seen.has(`${nbr}_${nbc}`) && rdiff+cdiff === dist+1 
    }).map(([fr,fc])=> [[fr,fc],[sr,sc],dist])
}

function checkBorders(cornersArray){
 let initialCorners = cornersArray.slice(0,4)
 let [[sr,sc],dist] = cornersArray.slice(-2)
 let queue = []
 
 // Populate initial queue for sensor border from each corner
 initialCorners.forEach(([br,bc])=>{
    seen.add(`${br}_${bc}`)
    let next = getNextBorderPoint(br,bc,sr,sc,dist)

    next.forEach((point)=> {
        seen.add(`${point[0][0]}_${point[0][1]}`)
        queue.push(point)
    })
 })

 // Loop around border of sensor 
 while(queue.length>0){
    counter++
    let [[pr,pc],[sr,sc],dist] = queue.shift()
    if(!sensorMap.some(([[r1,c1],[r2,c2],[r1min,r1max],[c1min,c1max],dist])=>(difference(pr,r1)+difference(pc,c1))<=dist && !beaconKeys.includes(`${pr}_${pc}`))){
        // Found the beacon
        console.log('beacon found on iteration ',counter,' position at row ',pr,' col ',pc)
        p2result = pr + (pc*4000000)
        break;
    } else {
        // Can't be a beacon
        let nextQueue = getNextBorderPoint(pr,pc,sr,sc,dist)
        nextQueue.forEach((pt)=> {
            seen.add(`${pt[0][0]}_${pt[0][1]}`)
            queue.push(pt)
        })
        if(counter%100000 === 0){
            //console.log('counter is ',counter,' and queue length is ',queue.length)
        }
    }
 }
 return p2result
}

// Loop border of each sensor till we find the matching co-ordinate
while(p2result === 0){
    p2result = checkBorders(borderCorners.shift())
}
console.log(p2result) // Part 2 result


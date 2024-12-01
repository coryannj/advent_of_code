const fs = require('fs');
const input = fs.readFileSync('../day24input.txt',{ encoding: 'utf8' });

const lcm2 = (a, b) => a*b / gcd2(a, b);
const gcd2 = (a, b) => {
if(!b) return b===0 ? a : NaN;
return gcd2(b, a%b);
}

let fullMap = input.split(/[\r\n]+/).map((x)=>x.split(''))
let map = fullMap.flatMap((x,ix)=>x.map((y,iy)=>'<>v^'.includes(y)?[y,ix,iy]:[])).filter((z)=>z.length>0)
let [rowLen,colLen] = [fullMap.length-2,fullMap[0].length-2]
let [minRow,maxRow,minCol,maxCol,lcm] = [1,rowLen,1,colLen,lcm2(rowLen,colLen)]
let startCol = fullMap[0].findIndex((x)=> x==='.')
let endCol = fullMap[maxRow+1].findIndex((x)=> x==='.')
let timeMap = {0:{'<':[],'>':[],'v':[],'^':[]}}
let coOrdMap ={0:[]}

map.forEach((x)=>{
    let key = x[0]
    timeMap['0'][key].push([x[1],x[2]])
    coOrdMap['0'].push(`${x[1]}-${x[2]}`)
})

function moveBlizzard(key,[r,c]){
    let nextBlizzard = {'<':[r,c-1],'>':[r,c+1],'v':[r+1,c],'^':[r-1,c]};
    if(key === '<'){ return c === minCol ? [r,maxCol] : nextBlizzard[key] };
    if(key === '>'){ return c === maxCol ? [r,minCol] : nextBlizzard[key] };
    if(key === 'v'){ return r===maxRow ? [minRow,c] : nextBlizzard[key] };
    if(key === '^'){ return r===minRow ? [maxRow,c] : nextBlizzard[key]};
}

let keys = ['<','>','v','^']

// Calculate all blizzard states
for(i=1;i<lcm;i++){
    timeMap[i]={}
    coOrdMap[i]=[]
    keys.forEach((key)=>{
        let coOrds = timeMap[i-1][key]
        timeMap[i][key]=[]
        for(j=0;j<coOrds.length;j++){
            let nextStep = moveBlizzard(key,coOrds[j])
            timeMap[i][key].push(nextStep)
            coOrdMap[i].push(nextStep.join('-'))
        }
    })
}

// Calculate all ground states
let groundMap={}
let startKey = [0,startCol]
let endKey = [maxRow+1,endCol]

for(k=0;k<lcm;k++){
    groundMap[k]=[startKey.join('-')]
    let blizzards = coOrdMap[k]
    for(l=1;l<maxRow+1;l++){
        for(m=1;m<maxCol+1;m++){
            let key = `${l}-${m}`
            if(blizzards.indexOf(key) === -1){
                groundMap[k].push(key)
            }
        }
    }
    groundMap[k].push(endKey.join('-'))
}

function getSteps (startTime,startRowCol,endRowCol){
    let pqueue = '.'.repeat(startTime+500).split('').map((x)=>[])
    pqueue[0].push([startTime,startRowCol.join('-')])
    let shortestMap = {}
    let counter = 0
    let seen = []
    let currentMin = 1000000
    let startK = startRowCol.join('-')
    let endK = endRowCol.join('-')
    let beforeEndKey = endRowCol[1] === endCol ? [maxRow,endCol] : [minRow,minCol]

    while(pqueue.findLastIndex((x)=>x.length>0) !== -1){
        counter++
        let [time,lastKey] = pqueue[pqueue.findLastIndex((x)=>x.length>0)].shift()
        let [r,c] = lastKey.split('-').map(Number)
        let manhattan
        
        if(currentMin < 1000000) {
            manhattan = (Math.abs(r - beforeEndKey[0]) + Math.abs(c-beforeEndKey[1])) 
        }
        
        if(currentMin === 1000000 || time+manhattan <= currentMin){
            time+=1
            let nextStep = [[r,c],[r,c+1],[r,c-1],[r+1,c],[r-1,c]].filter((x)=> groundMap[time%lcm].indexOf(x.join('-')) >=0 && !seen.includes(`${time}-${x.join('-')}`))
            if(nextStep.length > 0){        
                if(nextStep.findIndex((x)=>x.join('-') === endK) !== -1){
                    if(shortestMap[endK]===undefined){
                        shortestMap[endK] = time
                        currentMin = time
                        continue;
                    }

                    if(time<shortestMap[endK]){
                        shortestMap[endK] = time
                        currentMin = time
                    }

                } else {
                    nextStep.forEach(([nr,nc])=>{
                        if(shortestMap[`${nr}-${nc}`] === undefined || time<shortestMap[`${nr}-${nc}`]){
                            shortestMap[`${nr}-${nc}`] = time
                            seen.push(`${time}-${nr}-${nc}`)
                            pqueue[nr+nc].push([time,`${nr}-${nc}`])
                        } else {
                            if(time<=shortestMap[`${nr}-${nc}`]+10){
                                seen.push(`${time}-${nr}-${nc}`)
                                pqueue[nr+nc].push([time,`${nr}-${nc}`])
                            }
                        }
                    })
                }
            }
        }
    }

    return shortestMap[endK]
}

let firstTrip = getSteps(0,startKey,endKey) 
console.log(firstTrip) // Part 1 answer
let secondTrip = getSteps(firstTrip,endKey,startKey)
let thirdTrip = getSteps(secondTrip,startKey,endKey) 
console.log(thirdTrip) // Part 2 answer


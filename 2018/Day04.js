const fs = require('fs');
const input = fs.readFileSync('../day4input.txt',{ encoding: 'utf8', flag: 'r' });

const numRegex = /(\d+)/g
const guardRegex = /(?<=[#])(\d+)/g
const actionRegex = /([\d-\s:]+).*(Guard [#]\d+ begins shift|falls asleep|wakes up)/

// https://stackoverflow.com/questions/8495687/split-array-into-chunks
function* chunks(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n);
    }
}

let lines = input.split(/[\r\n]+/).map((x)=>x.match(actionRegex).slice(1,3)).map((z)=>{
    let split = z[0].split(' ')
    let time = new Date(`${split[0]}T${split[1]}:00+0000`)
    return [time,z[1]]
}).sort((a,b)=>a[0]-b[0])

// Part 1
let guardIndexes = lines.flatMap((x,ix)=> x[1].includes('Guard') ? ix : [])
let start = guardIndexes.shift()
let guards = {}

while(guardIndexes.length>0){
    let end = guardIndexes.shift()
    let thisGuard = lines.slice(start,end)
    let guardId = thisGuard[0][1].match(guardRegex)[0]
    let actions = [...chunks(thisGuard.slice(1),2)].map((x)=>x.map((y)=>y[0]))

    if(guards[guardId]===undefined){
        guards[guardId]= {
            'begins':[thisGuard[0][0]],
            'sleeps':actions
        }
    } else {
        guards[guardId]['begins'].push(thisGuard[0][0])
        actions.forEach((x)=>{
            guards[guardId]['sleeps'].push(x)
        })
    }
    start = end
}

let maxSleep = 0
let maxSleepId

Object.entries(guards).forEach(([id,v])=>{
    let asleep = 0
    v.sleeps.forEach(([sleeps,wakes])=>{
        asleep+= (wakes.getUTCMinutes()-sleeps.getUTCMinutes())
    })

    if(asleep>maxSleep){
        maxSleep = asleep
        maxSleepId = id
    }
})

let maxGuardSleeps = guards[maxSleepId]['sleeps']

let minutes = Array(60).fill('.').map((x,i)=>i)
let bestMinute = minutes.map((x)=>[x,maxGuardSleeps.filter((y)=>y[0].getUTCMinutes()<=x && x<=y[1].getUTCMinutes()-1).length]).sort((a,b)=>a[1]-b[1])

console.log(bestMinute.at(-1)[0]*parseInt(maxSleepId)) // Part 1 answer

// Part 2

let maxMinuteCount = 0
let maxMinute
let maxMinuteID

Object.entries(guards).forEach(([id,v])=>{
    let sleeps = v.sleeps

    let bestMinute = minutes.map((x)=>[x,sleeps.filter((y)=>y[0].getUTCMinutes()<=x && x<=y[1].getUTCMinutes()-1).length]).sort((a,b)=>a[1]-b[1])

    if(bestMinute.at(-1)[1]>maxMinuteCount){
        maxMinuteCount = bestMinute.at(-1)[1]
        maxMinute = bestMinute.at(-1)[0]
        maxMinuteID = id
    }
})

console.log(parseInt(maxMinuteID)*maxMinute) // Part 2 answer
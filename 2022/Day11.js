const fs = require('fs');
const input = fs.readFileSync('../day11input.txt',{ encoding: 'utf8', flag: 'r' });

const opRegex = /(?<=[=]\s)(.*)/
const testRegex = /(?<=[:]\s)(.*)/

let lines = input.split(/\n\n/).map((x)=> x.split(/[\r\n]+/).map((y,idx)=>{
    if (idx === 1) {
        return y.match(/(\d+)/g).map(Number) // items array
    } else if (idx === 2) {
        return y.match(opRegex)[0] // operations
    } else {
        return y.match(/(\d+)/g).map(Number)[0] // Monkey number, test, true, false
    }
}))

let monkeys = lines.map((x)=> [x[0],x[1]])
let p1monkeyMap = new Map()
let p1monkeyQueue = new Map()
let p2monkeyMap = new Map()
let p2monkeyQueue = new Map()
let lcm = lines.map((x)=>x[3]).reduce((acc,curr)=> acc*curr,1)

monkeys.forEach(([key,items])=>{
    p1monkeyMap.set(key,[])
    p1monkeyQueue.set(key,items.slice(0))
    p2monkeyMap.set(key,[])
    p2monkeyQueue.set(key,items.slice(0))
})

const getQueue = (p1orp2,monkeyidx) => p1orp2 === 'p1' ? p1monkeyQueue.get(monkeyidx) : p2monkeyQueue.get(monkeyidx)
const updateQueue = (p1orp2,monkeyidx,worry) => p1orp2 === 'p1' ? p1monkeyQueue.get(monkeyidx).push(worry) : p2monkeyQueue.get(monkeyidx).push(worry)

const monkeyBusiness = (noOfRounds,p1orp2) => {
    for(i=0;i<noOfRounds;i++) {
        let monkeyRound = [...p1monkeyQueue.keys()]
    
        monkeyRound.forEach((monkey)=>{
            let [monkeyKey,itemsignore,operation,test,iftrue,iffalse] = lines.find((x)=>x[0]===monkey)
    
            while (getQueue(p1orp2,monkey).length>0) {
                let old = getQueue(p1orp2,monkey).shift();
                let worry

                if (p1orp2 === 'p1') {
                    worry = Math.floor(eval(operation)/3)
                    p1monkeyMap.get(monkey).push(old)
                } else {
                    worry = Math.floor(eval(operation)) > lcm ? Math.floor(eval(operation))%lcm : Math.floor(eval(operation))
                    p2monkeyMap.get(monkey).push(old)
                }

                if (worry%test === 0) {
                    updateQueue(p1orp2,iftrue,worry)
                } else {
                    updateQueue(p1orp2,iffalse,worry)
                }
    
            }
    
        })
    }
    return p1orp2 === 'p1' ? [...p1monkeyMap.values()].map((x,ix)=>x.length) : [...p2monkeyMap.values()].map((x,ix)=>x.length)
}

let p1rounds = 20
let p2rounds = 10000

console.log(monkeyBusiness(p1rounds,'p1').sort((a,b)=> b-a).slice(0,2).reduce((acc,curr)=> acc*curr,1)) // Part 1 answer
console.log(monkeyBusiness(p2rounds,'p2').sort((a,b)=> b-a).slice(0,2).reduce((acc,curr)=> acc*curr,1)) // Part 2 answer


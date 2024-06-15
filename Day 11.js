const fs = require('fs');
const input = fs.readFileSync('../day11input.txt',{ encoding: 'utf8', flag: 'r' });

const opRegex = /(?<=[=]\s)(.*)/
const testRegex = /(?<=[:]\s)(.*)/

let lines = input.split(/\n\n/).map((x)=> x.split(/[\r\n]+/).map((y,idx)=>{
    if (idx === 1) {
        return y.match(/(\d+)/g).map(Number)
    } else if (idx === 2) {
        return y.match(opRegex)[0].split(' ')
    } else if (idx === 3) {
        return y.match(/(\d+)/g).map(Number)[0]
    } else if (idx > 3 && idx <= 5) {
        return parseInt(y.slice(-1))
    } else {
        return y.match(/(\d+)/g).map(Number)[0]
    }
}))
//console.log(lines)

let monkeys = lines.map((x)=> [x[0],x[1]])
let monkeyMap = new Map()
let monkeyQueue = new Map()
//console.log(monkeys)

monkeys.forEach(([key,items])=>{
    monkeyMap.set(key,[])
    monkeyQueue.set(key,items)
})

let rounds = 20

for(i=0;i<rounds;i++) {
    let monkeyRound = [...monkeyQueue.keys()]
    console.log('i is ',i,' and monkeyRound is ',monkeyRound)

    monkeyRound.forEach((monkey)=>{
        let mqueue = monkeyQueue.get(monkey)
        console.log('monkey is ',monkey,' and mqueue is ',mqueue)
        let [monkeyKey,itemsignore,operation,test,iftrue,iffalse] = lines.find((x)=>x[0]===monkey)
        //console.log(monkeyKey,itemsignore,operation,test,iftrue,iffalse)

        while (mqueue.length>0) {
            item = mqueue.shift()
            monkeyMap.get(monkey).push(item)
            let operationNum = operation[2] === 'old' ? item : parseInt(operation[2])
            //console.log('item is ',item,' operationNum is ',operationNum)
            let operationMap = {
                '+': item+operationNum,
                '-': item-operationNum,
                '*': item*operationNum,
                '/': item/operationNum
            }
            //console.log('operationMap is ',operationMap[operation[1]])
    
            //worry = operationMap[operation[1]]
            worry = Math.floor(operationMap[operation[1]]/3)
    
            if (worry%test === 0) {
                monkeyQueue.get(iftrue).push(worry)
            } else {
                monkeyQueue.get(iffalse).push(worry)
            }

        }
    })
    console.log(monkeyQueue)
}

console.log(monkeyQueue)
console.log([...monkeyMap.values()].map((x,ix)=>x.length))
console.log([...monkeyMap.values()].map((x,ix)=>x.length).sort((a,b)=> b-a).slice(0,2).reduce((acc,curr)=>acc*curr,1))


// while(rounds<20){
//     rounds++
//     [monkeyKey,items,operation,test,iftrue,iffalse] = queue.shift()
//     console.log(monkeyKey,items,operation,test,iftrue,iffalse)

//     items.forEach((item)=>{
//         monkeyMap.get(monkeyKey).push(item)
//         let operationNum = operation[2] === 'old' ? item : parseInt(operation[2])

//         let operationMap = {
//             '+': item+operationNum,
//             '-': item-operationNum,
//             '*': item*operationNum,
//             '/': item/operationNum
//         }
//         console.log('operationMap is ',operationMap[operation[1]])

//         worry = Math.floor(operationMap[operation[1]]/3)

//         if (worry%test === 0) {
//             let nextMonkeyTrue = lines.find((x)=> x[0] === iftrue)
//             nextMonkeyTrue[1] = [worry]
//             console.log('nextmonkeytrue ',nextMonkeyTrue)
//             queue.push(nextMonkeyTrue)
//         } else {
//             let nextMonkeyFalse = lines.find((x)=> x[0] === iffalse)
//             nextMonkeyFalse[1] = [worry]
//             console.log('nextMonkeyFalse',nextMonkeyFalse)
//             queue.push(nextMonkeyFalse)
//         }
//     })
// }

// console.log(monkeyMap)


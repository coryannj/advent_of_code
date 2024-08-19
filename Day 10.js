const fs = require('fs');
const input = fs.readFileSync('../day10input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map(Number).sort((a,b)=>a-b)
let maxJolts = lines.at(-1)+3
lines.push(maxJolts)

let queue = [0]
let list = lines.slice()
let seen = []
let adapters= new Map()
let fullAdapters = new Map()

while(queue.length>0){
    let currJolt = queue.shift()
    let matching = list.filter((x)=> x>currJolt && x<=currJolt+3 && !seen.includes(x))
    
    if(matching.length>0){
        fullAdapters.set(currJolt,matching)
        adapters.set(currJolt,matching.slice(0,1))
        seen.push(matching.at(0))
        queue.push(matching.at(0))
    }

}





let allAdapters = [...adapters.entries()]

let oneJolt = 0
let threeJolt = 0

allAdapters.forEach(([jolt,diffs])=>{
    diffs.forEach((diff)=>{
        if(diff === jolt+1){
            oneJolt++
        }
        if(diff === jolt+3){
            threeJolt++
        }
    })
})

console.log(oneJolt*threeJolt)




let combos = [...fullAdapters.entries()]


let queue2 = 0
let comboCount = []

while(queue2.length>0){
    let thisPath = queue2.shift()
    let last = next.at(-1)
    let nextPaths = []

    let nextArr = fullAdapters[last]

    if(nextArr.length === 1 && (nextArr.at(-1) === maxJolts ||fullAdapters[nextArr.at(-1)].length === 3)){
        comboCount.push(queue2)

    } else {

    }

}



console.log(combos.findIndex(([k,v],ix,arr)=> v.length === 1 && arr[ix+1][1].length>1))

let sliceStart = 0
let sliceEnd = combos.findIndex(([k,v],ix,arr)=> ix>sliceStart && v.length === 1 && (arr[ix+1][1].length===3||arr[ix+1][1].includes(maxJolts)))+1
console.log(sliceEnd)

let thisSlice = combos.slice(sliceStart,sliceEnd)
console.log(thisSlice)
let endVal = thisSlice.at(-1)[1][0]
console.log(endVal)
let comboTotal = []




while(sliceEnd !== -1){
    let thisSlice = combos.slice(sliceStart,sliceEnd)
    let endVal = thisSlice.at(-1)[1][0]
    let paths = new Set()

}
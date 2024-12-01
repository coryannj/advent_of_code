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

console.log(oneJolt*threeJolt) // Part 1 answer

// Part 2
let combos = [...fullAdapters.entries()]
let comboTotal = []
let combosLen = combos.length

let startIndex = 0
let sliceIndex = 0

while(sliceIndex<combosLen-1){
    sliceIndex = combos.findIndex((x,ix,arr)=>ix>startIndex && x[1].length === 1 && x[0]+3 === x[1][0] && (ix===combosLen-1||arr[ix+1][1].length>1))

    let comboSlice = combos.slice(startIndex,sliceIndex+1)
    let startNode = comboSlice[0][0]
    let endNode = comboSlice.at(-1)[1][0]

    let queue = [[startNode]]
    let result = []
    while(queue.length>0){
        let thisNode = queue.shift()
        let nextArr = fullAdapters.get(thisNode.at(-1))

        nextArr.forEach((nextNode)=>{
            if(nextNode !==endNode){
                queue.push(thisNode.concat(nextNode))
            } else {
                result.push(thisNode.concat(nextNode))
            }
        })
    }

    comboTotal.push(result.length)    
    startIndex = sliceIndex+1
}

console.log(comboTotal.reduce((acc,curr)=>acc*curr,1)) // Part 2 answer


const fs = require('fs');
const input = fs.readFileSync('../day25input.txt',{ encoding: 'utf8', flag: 'r' });

let fullMap = input.split(/[\r\n]+/).map((x)=>x.split(''))
let map = fullMap.flatMap((x,ix)=>x.map((y,iy)=>'>v.'.includes(y)?[y,ix,iy]:[])).filter((z)=>z.length>0)
let [maxRow,maxCol] = [fullMap.length-1,fullMap[0].length-1]
let stateMap = {}

map.forEach((x)=>{
    stateMap[`${x[1]}-${x[2]}`] = x[0]
})

function takeStep(stateObj){
    let eastKeys = Object.keys(stateObj).filter((x)=>{
        let [er,ec] = x.split('-').map(Number)
        let nextCol = ec===maxCol ? 0 : ec+1   
        return stateMap[x] === '>' && stateMap[`${er}-${nextCol}`] === '.'
    })

    eastKeys.forEach((key)=>{
        let [er,ec] = key.split('-').map(Number)
        let nextCol = ec===maxCol ? 0 : ec+1
        stateObj[key]='.'
        stateObj[`${er}-${nextCol}`] = '>'
    })

    let southKeys = Object.keys(stateObj).filter((x)=>{
        let [sr,sc] = x.split('-').map(Number)
        let nextRow = sr===maxRow ? 0 : sr+1   
        return stateMap[x] === 'v' && stateMap[`${nextRow}-${sc}`] === '.'
    })

    southKeys.forEach((key)=>{
        let [sr,sc] = key.split('-').map(Number)
        let nextRow = sr===maxRow ? 0 : sr+1 
        stateObj[key]='.'
        stateObj[`${nextRow}-${sc}`] = 'v'
    })

    if(eastKeys.length === 0 && southKeys.length === 0){
        //console.log('no movement')
        return false
    } else {
        return stateObj
    }

}

let counter = 0

while(stateMap !== false){
    counter++
    let newMap = takeStep(stateMap)
    stateMap = newMap
}

console.log(counter) // Part 1 answer
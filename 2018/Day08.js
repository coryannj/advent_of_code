const fs = require('fs');
const input = fs.readFileSync('../day8input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.toString().split(' ').map(Number)

let p1Lines = lines.slice()
let p2Lines = lines.slice()

// Part 1
function licence(){
    const children = p1Lines.shift()
    const metaCount = p1Lines.shift()

    let totalMeta = 0

    for(let i=0;i<children;i++){
        totalMeta+=licence()
    }
    
    for(let j=0;j<metaCount;j++){
        totalMeta+=p1Lines.shift()
    }

    return totalMeta
}

console.log(licence()) // Part 1

// Part 2
function p2licence(){
    const children = p2Lines.shift()
    const metaCount = p2Lines.shift()

    if(children === 0){
        let totalMeta = 0
        for(let i=0;i<metaCount;i++){
            totalMeta+=p2Lines.shift()
        }
        return totalMeta
    } else {
        let childCount = []
        let childMeta = []
        let totalMeta = 0
        for(let i=0;i<children;i++){
            childCount.push(p2licence())
        }

        for(let j=0;j<metaCount;j++){
            childMeta.push(p2Lines.shift())
        }

        totalMeta+= childMeta.map((x)=> childCount[x-1]===undefined ? 0 : childCount[x-1]).reduce((acc,curr)=>acc+curr,0)
        return totalMeta
    }    
}

console.log(p2licence()) // Part 2 answer
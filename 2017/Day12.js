const fs = require('fs');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(/[\W\s]+/).map(Number)).map((x)=>[x[0],x.slice(1)])

let list = new Map(lines)
let queue = [0]

let groups = new Map()
let groupInd = 0
groups.set(groupInd,[])
let seen = new Set()
seen.add(0)

while(queue.length>0){
    let next = queue.shift()
    let nextMap = list.get(next).filter((x)=>!seen.has(x))
    
    if(nextMap.length>0){
        nextMap.forEach((x)=>{
            queue.push(x)
            seen.add(x)
        })
    }

    groups.get(groupInd).push(next)

    if(queue.length === 0){
        let nextGroup = [...list.keys()].find((x)=>!seen.has(x))
        
        if(nextGroup !== undefined){
            queue.push(nextGroup)
            groupInd++
            groups.set(groupInd,[])
        }
    }

}

console.log([...new Set(groups.get(0))].length) // Part 1
console.log([...groups.keys()].length) // Part 2
const fs = require('fs');
const input = fs.readFileSync('../day7input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.replaceAll('.','').split(/[\r\n]+/).map((x)=>x.split(' bags contain ')).map(([k,v])=> [k,v.replaceAll(/\s+bag[s]{0,1}/g,'').replaceAll('no','0').split(', ')])

let bagMap = {}

lines.forEach(([k,v])=>{
    bagMap[k] = {};
    v.forEach((bag)=>{
        let split = bag.split(' ')
        bagMap[k][split.slice(1).join(' ')] = parseInt(split[0])
    })
})

// Part 1
let hasGold = Object.keys(bagMap).filter((x)=> Object.keys(bagMap[x]).includes('shiny gold'))

let goldCount = new Set(hasGold)

while(hasGold.length>0){
    let contains = Object.keys(bagMap).filter((x)=> Object.keys(bagMap[x]).some((y)=>hasGold.includes(y)))
    contains.forEach((x)=>goldCount.add(x))
    hasGold = contains
}

console.log(goldCount.size) // Part 1 answer

// Part 2
let queue = [['shiny gold',1]]
let mustContain = 0

while(queue.length>0){
    let [bag,quantity] = queue.shift()
    let contains = Object.entries(bagMap[bag])

    contains.forEach(([k,v])=>{
        if(v>0){
            mustContain += (v*quantity);
            queue.push([k,v*quantity])
        }
    })
}
console.log(mustContain) // Part 2 answer

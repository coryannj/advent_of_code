const { on } = require('events');
const fs = require('fs');
const input = fs.readFileSync('../day7input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.replace(/[)]$/m,'').split(/[\s\W]+/))

let towers = {}

lines.forEach((x)=>{
    if(towers[x[0]]===undefined){
        towers[x[0]]={'weight':parseInt(x[1])}
    }

    if(x.length>2){
        towers[x[0]]['below'] = x.slice(2)
    }
})

// Part 1
let allBelow = Object.values(towers).map((x)=>x.below).filter((x)=>x!==undefined).flat()
let onlyAbove = Object.keys(towers).filter((x)=> !allBelow.includes(x))

console.log(onlyAbove[0])

// Part 2
let tree = {}
tree[onlyAbove] = {'weight':towers[onlyAbove]['weight'],'totalWeight':towers[onlyAbove]['weight']}

// Build tree
let queue = [onlyAbove.slice()]
let nodes = []

while(queue.length>0){
    let next = queue.shift()
    let parentStr = `towers['${next.join(`']['`)}']`
    let treeStr = `tree['${next.join(`']['`)}']`
    let child = towers[next.at(-1)]

    if(child.below !== undefined){
        let children = child.below
        children.forEach((x)=>{
            eval(`tree['${next.join(`']['`)}']['${x}']={'weight':${towers[x]['weight']},'totalWeight':${towers[x]['weight']}}`)
            queue.push(next.slice().concat(x))
        })
    } else {
        nodes.push(next)
    }
}

// Populate weights from bottom up
let queue2 = structuredClone(nodes).sort((a,b)=>b.length-a.length)

while(queue2.length>0){
    let next = queue2.shift()
    let tWeight = eval(`tree['${next.join(`']['`)}']['totalWeight']`)

    eval(`tree['${next.slice(0,-1).join(`']['`)}']['totalWeight']+=${tWeight}`)

    if(queue2.findIndex((x)=>x.join('|')===next.slice(0,-1).join('|'))===-1 && next.slice(0,-1).length >1){
        queue2.push(next.slice(0,-1))
        queue2.sort((a,b)=>b.length-a.length)
    }
}

// Find unbalanced node
let queue3 = [Object.entries(tree[onlyAbove]).filter((x,ix,arr)=>x[0]!=='weight' && x[0]!=='totalWeight').find((x,ix,arr)=>arr.findIndex((z,zx)=>zx !== ix && z[1].totalWeight === x[1].totalWeight)===-1)]

let queue3Seen = []
let adjustedWeight

while(queue3.length>0){
    let node = queue3.shift()
    let next = Object.entries(node[1]).filter((x,ix,arr)=>x[0]!=='weight' && x[0]!=='totalWeight').find((x,ix,arr)=>arr.findIndex((z,zx)=>zx !== ix && z[1].totalWeight === x[1].totalWeight)===-1)

    if(next !==undefined){
        queue3.push(next)
        queue3Seen.push(node)
    } else {
        let correctWeight = Object.entries(queue3Seen.at(-1)[1]).filter((x,ix,arr)=>x[0]!=='weight' && x[0]!=='totalWeight').find((x,ix,arr)=>arr.findIndex((z,zx)=>zx !== ix && z[1].totalWeight === x[1].totalWeight)!==-1)[1].totalWeight

        let diff = Math.abs(correctWeight-node[1].totalWeight)
        
        adjustedWeight = node[1].totalWeight>correctWeight ? node[1].weight - diff : node[1].weight+diff
    }
}

console.log(adjustedWeight) // Part 2 answer

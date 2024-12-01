const fs = require('fs');
const input = fs.readFileSync('../day7input.txt',{ encoding: 'utf8', flag: 'r' });

const stepRegex = /(?<=tep )([A-Z])/g

let lines = input.split(/[\r\n]+/).map((x)=>x.match(stepRegex))

let startNodes = [...new Set(lines.map((x)=>x[0]))]
let endNodes = [...new Set(lines.map((x)=>x[1]))]
let allLength = [...new Set(lines.flat())].length

let firstNodes = startNodes.filter((x)=>!endNodes.includes(x)).sort((a,b)=>a.localeCompare(b))

let nodeMap = {}
let reverseMap = {}

lines.forEach(([s,e])=>{
    if(nodeMap[s]===undefined){
        nodeMap[s] = []
    }
    nodeMap[s].push(e)

    if(reverseMap[e]===undefined){
        reverseMap[e] = []
    }
    reverseMap[e].push(s)
})

// Part 1
let queue = startNodes.filter((x)=>!endNodes.includes(x)).sort((a,b)=>a.localeCompare(b))
let order = []

while(order.length<allLength){
    let thisNode = queue.find((x)=>!order.includes(x) && (reverseMap[x] === undefined || reverseMap[x].every((y)=>order.includes(y))))
    order.push(thisNode)

    let nextNodes = nodeMap[thisNode]
    
    if(nextNodes !== undefined){
        nextNodes = nextNodes.filter((x)=>!order.includes(x) && !queue.includes(x))
        
        nextNodes.forEach((x)=>queue.push(x))
        queue.sort((a,b)=>a.localeCompare(b))
    }
}

console.log(order.join('')) // Part 1 answer

// Part 2
let p2all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let p2queue = firstNodes
let p2order = []
let p2mins = 0
let offset = 60
let noWorkers = 5

let workers = {}

for(i=0;i<noWorkers;i++){
    let val = firstNodes.shift()
    workers[`w${i}`]=[val,0,p2all.indexOf(val)+offset]
}

while(p2order.length<allLength){
    p2mins++

    Object.keys(workers).forEach((k)=>{
        workers[k][1]++
        if(workers[k][1]===workers[k][2]&&workers[k][0] !== undefined){
            p2order.push(workers[k][0])

            let nextNodes = nodeMap[workers[k][0]]
        
            if(nextNodes !== undefined){
                nextNodes = nextNodes.filter((x)=>!p2order.includes(x) && !p2queue.includes(x) && !Object.values(workers).flatMap((x)=>x[0]).includes(x))
                
                nextNodes.forEach((x)=>p2queue.push(x))

            }
        }
    })

    p2queue = p2queue.filter((x)=>!Object.values(workers).flatMap((x)=>x[0]).includes(x) && !p2order.includes(x)).sort((a,b)=>a.localeCompare(b))

    Object.keys(workers).forEach((k)=>{
        let [val,mins,totalMins] = workers[k]

        if((mins===totalMins && val !== undefined)||val === undefined){
            let newVal = p2queue.find((x)=>!Object.values(workers).flatMap((x)=>x[0]).includes(x) && !p2order.includes(x) && (reverseMap[x] === undefined || reverseMap[x].every((y)=>p2order.includes(y))))
            
            workers[k] = [newVal,0,p2all.indexOf(newVal)+offset+1]
        }
    })

}

console.log(p2mins+1) // Part 2 answer

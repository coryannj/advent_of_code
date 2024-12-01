const fs = require('fs');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split('-'))
//console.log(lines)
let dgraph = {}

lines.forEach(([node1,node2])=>{
    if(dgraph[node1]===undefined){
        dgraph[node1] = []
    }
    
    if(node2 !== 'start'){
        dgraph[node1].push(node2)
    }
    

    if(node1 !== 'start' && node2 !== 'end'){
        if(dgraph[node2]===undefined){
            dgraph[node2]=[]
        }
        if(node1 !== 'start'){
            dgraph[node2].push(node1)
        }
        
    }
})

let queue = [['start']]
let paths = []

while(queue.length>0){
    let node = queue.shift()
    let next = dgraph[node.at(-1)].filter((x)=> (x === x.toLowerCase() && !node.includes(x))||x !== x.toLowerCase())

    next.forEach((newNode)=>{
        if(newNode === 'end'){
            paths.push(node.concat(newNode))
        } else {
            queue.push(node.concat(newNode))
        }
    })

}
console.log(paths.length) // Part 1 answer

let p2queue = [['start']]
let p2paths = []

while(p2queue.length>0){
    let node = p2queue.shift()
    let lowerCaseCount = node.filter((y)=> y === y.toLowerCase() && y !== 'start' && y !== 'end')
    let twoCaves = lowerCaseCount.some((smallCave,cx,carr)=> carr.indexOf(smallCave)!==carr.lastIndexOf(smallCave))

    let next = dgraph[node.at(-1)].filter((x,ix)=> {
        if(x !== x.toLowerCase()||x==='end'||(x === x.toLowerCase() && !node.includes(x))){
            return true
        } else {
            if(lowerCaseCount.length === 0 || !twoCaves){
                return true
            } else {
                return false
            }
        }
    })

    next.forEach((newNode)=>{
        if(newNode === 'end'){
            p2paths.push(node.concat(newNode))
        } else {
            p2queue.push(node.concat(newNode))
        }
    })

}

console.log(p2paths.length) // Part 2 answer

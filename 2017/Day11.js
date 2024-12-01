const fs = require('fs');
const input = fs.readFileSync('../day11input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(',')
let p1lines = lines.slice()

// Used cube co-ordinates from https://www.redblobgames.com/grids/hexagons/#neighbors

let curr = [0,0,0]

let coords = ['0|0|0']

while(p1lines.length>0){
    let hex = {
        'n': [0,-1,1],
        's': [0,1,-1],
        'nw':[-1,0,1],
        'se':[1,0,-1],
        'ne':[1,-1,0],
        'sw':[-1,1,0]
    }
    let next = hex[p1lines.shift()].map((x,ix)=>x+curr[ix])

    coords.push(next.join('|'))
    curr = next
}

console.log(curr.map((x)=>Math.abs(x)/2).reduce((acc,curr)=>acc+curr,0)) // Part 1

console.log(coords.map((x)=>x.split('|').map(Number)).map(([q,r,s])=>(Math.abs(q)+Math.abs(r)+Math.abs(s))/2).sort((a,b)=>b-a)[0]) // Part 2


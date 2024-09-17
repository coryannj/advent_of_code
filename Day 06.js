const fs = require('fs');
const input = fs.readFileSync('../day6input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(')'))

let orbits = {}

lines.forEach(([p,orbit])=>{
    if(orbits[p]===undefined){
        orbits[p] = [orbit]
    } else {
        orbits[p].push(orbit)
    }
})

let orbiting = [...new Set(Object.values(orbits).flat())]
let orbitTotal = 0
orbiting.forEach((planet)=>{
    let queue = [planet]
    let orbitsFound = new Set()
    while(queue.length>0){
        let thisPlanet = queue.shift()
        let getOrbits = Object.keys(orbits).filter((x)=>orbits[x].includes(thisPlanet))
        getOrbits.forEach((key)=>{
            orbitsFound.add(key)
            queue.push(key)
        })
    }
    orbitTotal+=orbitsFound.size

})

console.log(orbitTotal) // Part 1 answer

let start = Object.keys(orbits).filter((x)=>orbits[x].includes('YOU'))[0]
let end = Object.keys(orbits).filter((x)=>orbits[x].includes('SAN'))[0]

let p2queue = Array(50000).fill('.').map((x)=>[])
p2queue[0].push([start])

while(p2queue.some((x)=>x.length>0)){
    let path = p2queue[p2queue.findIndex((x)=>x.length>0)].shift()
    let last = path.at(-1)
    let nextOrbiting = Object.keys((orbits)).filter((x)=>!path.includes(x) && orbits[x].includes(last))
    let nextOrbits = orbits[last] !== undefined ?orbits[last].filter((x)=>!path.includes(x)) : []

    if(!nextOrbiting.includes(end)&& !nextOrbits.includes(end)){
        nextOrbiting.forEach((x)=>{
            p2queue[path.length+1].push(path.concat(x))
        })

        nextOrbits.forEach((x)=>{
            p2queue[path.length+1].push(path.concat(x))
        })
    } else {
        console.log('path length is ',path.length) // Part 2 answer
    }
}
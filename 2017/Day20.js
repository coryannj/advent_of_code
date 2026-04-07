const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2017/day20.txt', {encoding: "utf8", flag: "r", });

let buffer = input.split(/\n/g).map((x,i)=>[i,x.match(/[-\d]+/g).map(Number).chunks(3)])

const update = ([i,[[px,py,pz],[vx,vy,vz],[ax,ay,az]]]) =>[i, [[px+(vx+ax),py+(vy+ay),pz+(vz+az)],[vx+ax,vy+ay,vz+az],[ax,ay,az]]]

const manhattan = ([i,[[px,py,pz],[vx,vy,vz],[ax,ay,az]]],[tx,ty,tz]) => Math.abs(px-tx)+Math.abs(py-ty)+Math.abs(pz-tz)


const solve = (partNo) => {
    let rounds = 400
    let particles = buffer
    let distances = partNo === 1 ? Array(buffer.length).fill().map((x)=>0) : []

    while(rounds--){
    let seen = new Set()
    let duplicate = new Set()

    particles = particles.map((x,i)=>{
        let nVal = update(x)
        
        if(partNo === 1){
            distances[i]+=manhattan(nVal,[0,0,0])
        } else {
            let key = nVal[1][0].join('_')
            
            if(!seen.has(key)){
                seen.add(key)
            } else {
                duplicate.add(key)
            }
        } 
        
        return nVal
    })

    if(partNo === 2) particles = particles.filter(([i,[p,v,a]])=> !duplicate.has(p.join('_')))

    }

    return partNo === 1 ? distances.indexOf(Math.min(...distances)) : particles.length
}

console.log(solve(1))
console.log(solve(2))
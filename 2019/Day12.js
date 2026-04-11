const fs = require('fs');
const { lcm, gcd } = require('../inputs/utils.js');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2019/day12.txt', {encoding: "utf8", flag: "r", })

let moons = input.split(/\n/g).map((x)=>[x.match(/([+-]?\d+)/g).map(Number),[0,0,0]])

let seen = Object.fromEntries(Array(3).fill().map((x,i)=>[i,new Set()]))
let seenTwice = [false,false,false]
let seenSteps = [0,0,0]
let steps = 1000
let count = 0

const findSeen = () => {
    for(i=0;i<3;i++){
        if(seenTwice[i]) continue;
        
        let key = moons.map((x)=>x[0][i]).concat(moons.map((x)=>x[1][i])).join('_')
        
        if(seen[i].has(key)){
            seenTwice[i] = true
            seenSteps[i] = count
        } else {
            seen[i].add(key)
        }
    }
}

findSeen()

while(seenTwice.some((x)=>!x)){
    count++
    moons.forEach(([pos1,v1],i)=>{
        moons.slice(i+1).forEach(([pos2,v2],ri)=>{
            pos1.forEach((p,pi)=>{
                if(p !== pos2[pi]){
                    if(p>pos2[pi]){
                        moons[i+1+ri][1][pi]++
                        moons[i][1][pi]--
                    } else {
                        moons[i+1+ri][1][pi]--
                        moons[i][1][pi]++
                    }
                }
            })
        })

        moons[i][1].forEach((v,vi)=>moons[i][0][vi]+=v)
    })

    findSeen()

    if(count === steps){
        console.log(moons.map((x)=>x.reduce((a,c)=>a*c.reduce((a2,c2)=>a2+Math.abs(c2),0),1)).reduce((a,c)=>a+c)) // Part 1 answer
    }
}

console.log(seenSteps.reduce((a,c)=>lcm(a,c))) // Part 2 answer
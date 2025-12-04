const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day4.txt', {encoding: "utf8", flag: "r", });

let
    lines = input.split(/[\r\n]/).map((x,xi)=>x.split('')),
    p1 = 0,
    p1Accessed = [],
    p2Obj = {}

// Part 1    
lines.forEach((x,xi,a)=>{
    x.forEach((y,yi)=>{
        if(y==='@'){
            let aKeys = []

            for(k=-1;k<=1;k++){
                for(l=-1;l<=1;l++){
                    if(k===0 && l===0) continue;
                    let nr = xi+k
                    let nc = yi+l

                    if(a[nr]?.[nc] === '@') {
                        aKeys.push(`${nr}-${nc}`)
                    }
                }
            }

            let len = aKeys.length
            
            if(len<4){
                p1Accessed.push(aKeys)
            } else {
                p2Obj[`${xi}-${yi}`] = [len,aKeys]
            }
        }
    })
})

p1 = p1Accessed.length

console.log('Part 1 answer is ',p1)

// Part 2
let
    p2=p1,
    p2Queue = p1Accessed.values(),
    n = p2Queue.next()

const allAccessed = (next) => { 
    if(next.every((nk)=>!p2Obj[nk])) return 0;

    let result = 0

    next.forEach((nk)=>{
        if(p2Obj[nk]){
            p2Obj[nk][0]--
            if(p2Obj[nk][0]<4){
                result++
                let [nextCount,nextKeys] = p2Obj[nk]
                p2Obj[nk] = undefined
                result+=allAccessed(nextKeys)
            } 
        } 
    })

    return result
}

while(!n.done){
    p2+=allAccessed(n.value)
    n = p2Queue.next()
}

console.log('Part 2 answer is ',p2)
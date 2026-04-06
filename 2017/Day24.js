const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2017/day24.txt', {encoding: "utf8", flag: "r", });

let components = input.split(/\n/g).map((x)=>x.split('/').map(Number))

let queue = components.filter(([n1,n2])=> n1 === 0 || n2 === 0).map((x)=>[x])

let strongest = 0
let longest = 0
let longestStrongest = 0

while(queue.length){
    let next = queue.shift()
    let last = next.at(-1)
    let prev = next?.at(-2)
    //console.log(next,last,prev)
    let connector = prev === undefined || last[0] === last[1] ? Math.max(...last) : last.find((x)=>!prev.includes(x))

    let nextArr = components
        .filter((x)=> x.includes(connector) && next.every((y)=>y.join('_') !== x.join('_')))
        .forEach((x)=> {
            queue.push(next.concat([x]))
        })

    if(!nextArr?.length){
        let sum = next.flat().reduce((a,c)=>a+c)
        if(sum>strongest){
            strongest = sum
        } 

        if(next.length>=longest){
            if(next.length>longest){
                longest = next.length
                longestStrongest = sum
            } else {
                if(sum>longestStrongest) longestStrongest = sum
            }
            
            //console.log(longest,sum,longestStrongest)
            
        }
    }
    
}

console.log(strongest)
console.log(longest,longestStrongest)
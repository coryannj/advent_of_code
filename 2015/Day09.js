const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2015/day09.txt', {encoding: "utf8", flag: "r", });

let
    lines = input.split(/\n/g).map((x)=>x.split(' ').filter((y,yi)=>yi%2===0 )),
    cities = new Set(lines.flatMap((x)=>x.slice(0,-1))),
    routes = Object.fromEntries([...cities].map((x)=>[x,{}]))

cities.values().forEach((x)=>{
    let r = lines.filter((v)=>v[0]===x || v[1] === x)

    r.forEach(([s,e,dist])=>{
        routes[s][e] = +dist
        routes[e][s] = +dist
    })
})

let
    len = cities.size,
    min = Infinity,
    max = 0

function* cartesian(head, ...tail) {
    const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
    for (let r of remainder){
        for (let h of head){
            if(r.length === 0){
                yield [h, ...r];
            } else {
                if(!r.includes(h)){
                    if([h, ...r].length === len){
                        let dist = [h, ...r].map((x,i,a)=> i<a.length-1 ? routes[x][a[i+1]] : 0).reduce((a,c)=>a+c,0)
                        if(dist<min){
                            min = dist
                            yield [h, ...r]
                        }
                        if(dist>max){
                            max = dist
                            yield [h, ...r]
                        }
                    } else {
                        yield [h, ...r];
                    }
                }
            }
        } 
    }
} 

let permute = cartesian(...Array(len).fill().map((x)=>[...cities]))
let curr

do{
    curr = permute.next()
} while(!curr.done)

console.log(min)
console.log(max)
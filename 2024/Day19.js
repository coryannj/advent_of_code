const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day19.txt', {encoding: "utf8", flag: "r", });

let [patterns,towels] = input.lines(2).map((x,ix)=>ix === 0 ? x.split(/\W+/):x.lines())

let pObj = Object.fromEntries([...new Set(patterns.map((x)=>x[0]))].sort().map((x)=>[x,[]]))

patterns.forEach((x)=>{
    pObj[x[0]].push(x)
})

Object.keys(pObj).forEach((x)=>pObj[x].sort((a,c)=>a.length-c.length))

// Shoutout to Alvin the programmer's Dynamic programming YT vid :-D https://www.youtube.com/watch?v=oBt53YbR9Kk
let memo = {}

const matchTowel = (towel) =>{
    if(Object.hasOwn(memo, towel)) return memo[towel];
    
    if(!towel.length) return true;
    
    for(let pattern of pObj[towel[0]]){
        if(pattern.length>towel.length) break;

        if(towel.indexOf(pattern)===0){
            let remaining = towel.slice(pattern.length)
            if(matchTowel(remaining)){
                memo[towel] = true
                return true
            }
        }
    }

    memo[towel] = false
    return false
}

const allMatches = (towel) =>{
    let tLen = towel.length
    const tAll = Array(tLen+1).fill(0)
    tAll[0] = 1

    for(i=0; i<=tLen; i++){
        if(pObj[towel[i]]===undefined) continue;

        for(let pattern of pObj[towel[i]]){
            if(pattern.length>tLen-i) break;

            if(towel.slice(i,i+pattern.length)===pattern){
                tAll[i+pattern.length]+=tAll[i]
            }
        }
    }

    return tAll[towel.length]
}

let p1 = 0;
let p2 = 0;
let t0 = performance.now();

for(const t of towels){
    if(matchTowel(t,patterns)){
        p1++
        p2+=allMatches(t,patterns)
    } 
}

let t1 = performance.now();

console.log(p1,p2,t1-t0)
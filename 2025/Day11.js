const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day11.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/[\r\n]+/).map((x)=>x.match(/[a-z]+/g)).map((x)=>[x[0],x.slice(1)])

let adj= Object.fromEntries(lines)

const getPaths = ([s,e],partNo) => {
    let memo = {}

    const traversep1 = (next) => {
        if(memo[`${next}`] !== undefined) return memo[`${next}`];
        if(next === e) return 1;

        memo[`${next}`] = (adj[next] ?? []).reduce((a,c)=> a += traversep1(c),0)

        return memo[`${next}`]
    }
    
    const traversep2 = (next,hasFft,hasDac) => {
        if(memo[`${next}-${hasFft}-${hasDac}`] !== undefined) return memo[`${next}-${hasFft}-${hasDac}`];
        if(next === e) return hasDac && hasFft ? 1 : 0;
        
        if(next === 'fft') hasFft = true
        if(next === 'dac') hasDac = true

        memo[`${next}-${hasFft}-${hasDac}`] = (adj[next] ?? []).reduce((a,c)=> a += traversep2(c,hasFft,hasDac),0)

        return memo[`${next}-${hasFft}-${hasDac}`]
    }
    
    return adj[s].reduce((a,c)=> a += (partNo === 1 ? traversep1(c) : traversep2(c,false,false)),0)
}

console.log(getPaths(['you','out'],1))
console.log(getPaths(['svr','out'],2))
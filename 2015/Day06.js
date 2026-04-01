const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day06.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/\n/g).map((x)=>[x.match(/(toggle|off|on)/m)[0],x.match(/\d+/g)]).map(([ins,r])=> [ins,
    [Math.min(r[0],r[2]),Math.max(r[0],r[2])],
    [Math.min(r[1],r[3]),Math.max(r[1],r[3])],
])

const solve = (partNo) => {
    let lights = Array(1000).fill().map((x,xi)=>Array(1000).fill().map((y,yi)=>0))

    lines.forEach(([ins,[r1,r2],[c1,c2]])=>{
        for(i=r1;i<r2+1;i++){
            for(j=c1;j<c2+1;j++){
                if(ins === 'on'){
                    lights[i][j] = partNo === 1 ? 1 : lights[i][j]+1
                } else if (ins === 'off'){
                    lights[i][j] = partNo === 1 ? 0 : Math.max(lights[i][j]-1,0)
                } else {
                    lights[i][j] = partNo === 1 ? +(!lights[i][j]) : lights[i][j]+2
                }
            }
        }
    })

    return lights.flat().reduce((a,c)=>a+c,0)
}

console.log(solve(1))
console.log(solve(2))
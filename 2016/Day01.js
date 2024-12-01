const fs = require('fs');
const input = fs.readFileSync('../2016/day1input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[,\s]+/).map((x)=>[x[0],parseInt(x.slice(1))])
let coOrd = [0,0,'U']
let seen = [coOrd.slice(0,2).join('|')]
let hqFound = false
let hq

const walk = ([r,c,dir],[nextDir,steps]) => {
    let next
    for(i=1;i<=steps;i++){
        let nextObj = {
            'R':{
                'R':[r+i,c,'D'],
                'L':[r-i,c,'U']
            },
            'L':{
                'R':[r-i,c,'U'],
                'L':[r+i,c,'D']
            },
            'U':{
                'R':[r,c+i,'R'],
                'L':[r,c-i,'L']
            },
            'D':{
                'R':[r,c-i,'L'],
                'L':[r,c+i,'R']
            }
        }

        next = nextObj[dir][nextDir]

        if(!hqFound){
            if(seen.includes(next.slice(0,2).join('|'))){
                hqFound = true
                hq = next
            } else {
                seen.push(next.slice(0,2).join('|'))
            }   
        }
    }

    return next
}

lines.forEach(([nd,ns])=>{
    coOrd = walk(coOrd,[nd,ns])
})

console.log(Math.abs(coOrd[0])+Math.abs(coOrd[1])) // Part 1 answer

console.log(Math.abs(hq[0])+Math.abs(hq[1])) // Part 2 answer
const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day6.txt', {encoding: "utf8", flag: "r", });

const a = input.split(/[\r\n]+/).map((x)=>x.split(''));

// Part 1
let startR = a.findIndex((x)=>x.includes('^'));
let startC = a[startR].indexOf('^');
a[startR][startC] = '.';
let start = [startR,startC,'U'];

const walk = (coOrd,partNo) => {
    let seen = new Set();

    const step = ([r,c,dir]) => {
        let nextObj = {
            'R':[r,c+1,'R'],
            'L':[r,c-1,'L'],
            'U':[r-1,c,'U'],
            'D':[r+1,c,'D'],
        }

        let turnObj =  {'R':'D','L':'U','U':'R','D':'L'}

        let [nr,nc,nd] = nextObj[dir]
        let nextVal = a[nr]?.[nc]

        if(!nextVal){
            return undefined
        } else {
            while(nextVal === '#'){
                [nr,nc,nd] = nextObj[turnObj[nd]]
                nextVal = a[nr][nc]
            }
            return [nr,nc,nd]
        }        
    }

    while(coOrd !== undefined){
        if(partNo === 2 && seen.has(coOrd.join('|'))) break;
        partNo === 1 ? seen.add(coOrd.slice(0,2).join('|')) : seen.add(coOrd.join('|'))
        coOrd = step(coOrd);
    }
    
    if(coOrd === undefined){
        return partNo === 1 ? [seen.size,seen] : 0
    } else {
        return 1
    }
}

let [p1,p1path] = walk(start,1)

// Part 2
p1path.delete(start.slice(0,2).join('|'))
let p2 = 0

for(const item of p1path){
    let [r,c] = item.split('|').map(Number);
    a[r][c] = '#';
    p2+=walk(start,2);
    a[r][c] = '.';
}

console.log(p1,p2)
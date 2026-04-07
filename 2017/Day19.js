const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2017/day19.txt', {encoding: "utf8", flag: "r", });

const grid = input.split(/\n/g).map((x)=>x.split(''))
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const oppDir = {U:'D',D:'U',L:'R',R:'L'}
const cDirs = (r,c) => [[r+1,c,'D'],[r-1,c,'U'],[r,c-1,'L'],[r,c+1,'R']].filter(([nr,nc,nd])=> grid?.[nr]?.[nc] !== ' ').map((x)=>x[2])

let vertices = []
let result = ''

grid.forEach((row,r)=>{
    row.forEach((val,c)=>{
        if(alphabet.includes(val)|| val === '+') vertices.push([val,[r,c],cDirs(r,c)])
    })
})

let currPos = [0,grid[0].indexOf('|'),'D']

let distance = 0

while(currPos){
    let [r,c,currDir] = currPos
    let next

    if(currDir === 'U'){
        next = vertices.findLast(([nv,[nr,nc],nd])=> c === nc && nr < r && nd.includes(oppDir[currDir]))
    } else if (currDir === 'D'){
        next = vertices.find(([nv,[nr,nc],nd])=> c === nc && nr > r && nd.includes(oppDir[currDir]))
    } else if (currDir === 'R'){
        next = vertices.find(([nv,[nr,nc],nd])=> nr === r && nc > c && nd.includes(oppDir[currDir]))
    } else {
        next = vertices.findLast(([nv,[nr,nc],nd])=> nr === r && nc < c && nd.includes(oppDir[currDir]))
    }
    
    if(next === undefined) break;
    
    let [nv,[nr,nc],[nd1,nd2]] = next
    
    distance+=(Math.abs(r-nr)+Math.abs(c-nc))
    
    if(alphabet.includes(nv)) result+=nv
    
    currPos = [nr,nc,nd1 !== oppDir[currDir] ? nd1 : nd2]
}

console.log(result) // Part 1
console.log(distance+1) // Part 2
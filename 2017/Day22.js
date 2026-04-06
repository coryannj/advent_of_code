const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2017/day22.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/\n/g).map((x)=>x.split(''))
let rowLen = lines.length
let colLen = lines[0].length
let start = [Math.floor(rowLen/2),Math.floor(colLen/2),'U']

const solve = (partNo) => {
    let grid = Object.fromEntries(lines.flatMap((x,xi)=>x.map((y,yi)=>[`${xi}_${yi}`,y === '#' ? 'I' : 'C'])))
    let infected = 0
    let bursts = partNo === 1 ? 10000 : 10000000
    let pos = start.slice()

    const move = ([r,c,dir]) => {
        let currVal = grid[`${r}_${c}`] || 'C'
  
        const findDir = {
            U: {L:'L',R:'R',opp:'D'},
            D: {L:'R',R:'L',opp:'U'},
            L: {L:'D',R:'U',opp:'R'},
            R: {L:'U',R:'D',opp:'L'}
        }

        const nextDir = {
            U:[r-1,c,'U'],
            D:[r+1,c,'D'],
            L:[r,c-1,'L'],
            R:[r,c+1,'R']
        }
        
        const updateNode = {
            'C':(partNo) => {
                        grid[`${r}_${c}`] = partNo === 1 ? 'I' :'W';
                        if(partNo === 1) infected++
                        return nextDir[findDir[dir]['L']]
                    },
            'W':() => {
                        grid[`${r}_${c}`] = 'I'; 
                        infected++;
                        return nextDir[dir]
                    },
            'I':(partNo) => {
                        grid[`${r}_${c}`] = partNo === 1 ? 'C' : 'F';
                        return nextDir[findDir[dir]['R']]
                    },
            'F':() => {
                        grid[`${r}_${c}`] = 'C';
                        return nextDir[findDir[dir]['opp']]
                    } 
        }

        return updateNode[currVal](partNo)
    }

    while(bursts--){
        pos = move(pos)
    }

    return infected
}

console.log(solve(1))
console.log(solve(2))
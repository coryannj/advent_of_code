const fs = require('fs');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>[x.charAt(0),Number(x.slice(1))])
//console.log(lines)

function move(currpos,action){
    let [r,c,dir] = currpos
    let [nd,steps] = action
    let nextSteps = {
        'N':{
            'N':[r-steps,c,'N'],
            'S':[r+steps,c,'N'],
            'E':[r,c+steps,'N'],
            'W':[r,c-steps,'N'],
            'F':[r-steps,c,'N']
        },
        'S':{
            'N':[r-steps,c,'S'],
            'S':[r+steps,c,'S'],
            'E':[r,c+steps,'S'],
            'W':[r,c-steps,'S'],
            'F':[r+steps,c,'S']
        },
        'E':{
            'N':[r-steps,c,'E'],
            'S':[r+steps,c,'E'],
            'E':[r,c+steps,'E'],
            'W':[r,c-steps,'E'],
            'F':[r,c+steps,'E']
        },
        'W':{
            'N':[r-steps,c,'W'],
            'S':[r+steps,c,'W'],
            'E':[r,c+steps,'W'],
            'W':[r,c-steps,'W'],
            'F':[r,c-steps,'W']
        }
    }

    let nextFacing = {
        'NR': {90: 'E',180:'S', 270: 'W'},
        'NL': {90: 'W',180:'S', 270: 'E'},
        'SR': {90: 'W',180:'N', 270: 'E'},
        'SL': {90: 'E',180:'N', 270: 'W'},
        'ER': {90: 'S',180:'W', 270: 'N'},
        'EL': {90: 'N',180:'W', 270: 'S'},
        'WR': {90: 'N',180:'E', 270: 'S'},
        'WL': {90: 'S',180:'E', 270: 'N'},
    }

    if('NSEWF'.includes(nd)){
        return nextSteps[dir][nd]
    } else {
        return [r,c,nextFacing[`${dir}${nd}`][steps]]
    }
}

let p1Pos = [0,0,'E']

let p1Actions = structuredClone(lines)

while(p1Actions.length>0){
    let nextpos = move(p1Pos,p1Actions.shift())
    p1Pos = nextpos
}

console.log(Math.abs(0-p1Pos[0])+Math.abs(0-p1Pos[1]))
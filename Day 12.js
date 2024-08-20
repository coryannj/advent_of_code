const fs = require('fs');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>[x.charAt(0),Number(x.slice(1))])
//console.log(lines)

// Part 1
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

console.log(Math.abs(0-p1Pos[0])+Math.abs(0-p1Pos[1])) // Part 1 answer




function p2Move(currpos,waypoint,action){
    let [r,c,dir] = currpos
    let [nd,steps] = action
    let [wr,wc] = waypoint

    if(nd === 'L' || nd === 'R'){
        let rotation = {
            'R':[[-wc,wr],[-wr,-wc],[wc,-wr]],
            'L':[[wc,-wr],[-wr,-wc],[-wc,wr]]
        }

        let degreesIndex = (steps/90) -1

        return{'position':currpos,'waypoint':rotation[nd][degreesIndex]}

    } else {
        let nextSteps = {
            'N':{'position':currpos,'waypoint':[wr+steps,wc]},
            'S':{'position':currpos,'waypoint':[wr-steps,wc]},
            'E':{'position':currpos,'waypoint':[wr,wc+steps]},
            'W':{'position':currpos,'waypoint':[wr,wc-steps]},
            'F':{'position':[r+(steps*wr),c+(steps*wc),dir],'waypoint':waypoint}
        }

        return nextSteps[nd]
    }

}
let p2Pos = [0,0,'E']
let p2waypoint = [1,10]
let p2Actions = structuredClone(lines)

while(p2Actions.length>0){
    let nextpos = p2Move(p2Pos,p2waypoint,p2Actions.shift())
    p2Pos = nextpos.position
    p2waypoint = nextpos.waypoint
}

console.log(Math.abs(0-p2Pos[0])+Math.abs(0-p2Pos[1])) // Part 2 answer


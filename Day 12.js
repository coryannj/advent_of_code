const fs = require('fs');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>[x.charAt(0),Number(x.slice(1))])
//console.log(lines)

// Part 1
function move(currpos,action){
    let [r,c,dir] = currpos
    let [nd,steps] = action

    let nextSteps = {
        'N':[r+steps,c,dir],
        'S':[r-steps,c,dir],
        'E':[r,c+steps,dir],
        'W':[r,c-steps,dir]
    }
    
    if(nd === 'F'){
        return nextSteps[dir]
    } else if ('NSEW'.includes(nd)){
        return nextSteps[nd]
    } else {
        let nextFacing = ['N','E','S','W'];
        let currIndex = nextFacing.indexOf(dir);
        let degrees = nd === 'L' ? -1*(steps/90) : (steps/90);
    
        return [r,c,nextFacing.at((currIndex+degrees)%4)]
    }
}

let p1Pos = [0,0,'E'];
let p1Actions = structuredClone(lines);

while(p1Actions.length>0){
    let nextpos = move(p1Pos,p1Actions.shift())
    p1Pos = nextpos
}

console.log(Math.abs(0-p1Pos[0])+Math.abs(0-p1Pos[1])) // Part 1 answer

// Part 2
function p2Move(currpos,waypoint,action){
    let [r,c,dir] = currpos
    let [nd,steps] = action
    let [wr,wc] = waypoint

    if(nd === 'L' || nd === 'R'){
        let rotation = {
            'R':[[-wc,wr],[-wr,-wc],[wc,-wr]],
            'L':[[wc,-wr],[-wr,-wc],[-wc,wr]]
        }

        let degreesIndex = (steps/90)-1

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


const fs = require('fs');
const input = fs.readFileSync('../day3input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(',')).map((x)=>x.map((y)=>[y[0],parseInt(y.slice(1))]))

let rc = [5000,5000]

let grid = {}
let stepsToPoint = {}

const nextStep = ([r,c],dir) => {
    let next = {
        'R':[r,c+1],
        'L':[r,c-1],
        'U':[r-1,c],
        'D':[r+1,c]
    }
    return next[dir]
}

grid[rc.join('-')] = 1

function path([r,c],[dir,steps],totalSteps,l1orl2){
    let currPos = [r,c]
    let stepsTaken = 0

    while(stepsTaken<steps){
        totalSteps++
        let next = nextStep(currPos,dir)
        if(l1orl2 === 'l1'){
            grid[next.join('-')] = 1
            if(stepsToPoint[next.join('-')]===undefined){
                stepsToPoint[next.join('-')] = {'l1':totalSteps,'l2':100000000}
            }else {
                if(totalSteps<stepsToPoint[next.join('-')]['l1']){
                    stepsToPoint[next.join('-')]['l1']=totalSteps
                }
            }
        } else {
            if(grid[next.join('-')] !== undefined && grid[next.join('-')] === 1){
                grid[next.join('-')]++
            }

            if(stepsToPoint[next.join('-')] !== undefined){
                if(totalSteps<stepsToPoint[next.join('-')]['l2']){
                    stepsToPoint[next.join('-')]['l2']=totalSteps
                }
            }
        }
        currPos = next
        stepsTaken++
    }
    return [currPos,totalSteps]
}

let l1steps = 0
lines[0].forEach((x)=>{
    [rc,l1steps] = path(rc,x,l1steps,'l1')

})

rc = [5000,5000]
let l2steps = 0
lines[1].forEach((x)=>{
    [rc,l2steps] = path(rc,x,l2steps,'l2')
})

let [sr,sc] = [5000,5000]
let manhattan = 1000000

Object.entries(grid).filter(([k,v])=>v >1).forEach(([k,v])=>{
    let [dr,dc] = k.split('-').map(Number)
    let distance = Math.abs(sr-dr)+Math.abs(sc-dc)
    if(distance<manhattan){
        manhattan = distance
    }
})

console.log(manhattan) // Part 1 answer


console.log(Math.min(...Object.entries(stepsToPoint).filter(([k,v])=>v.l2<100000000).map(([k,v])=>Object.values(v).reduce((acc,curr)=>acc+curr,0)).sort((a,b)=>a-b))) // Part 2 answer
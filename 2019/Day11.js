const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2019/day11.txt', {encoding: "utf8", flag: "r", })

let lines = input.split(',').map(Number)

const runProgram = ({currInd,rBase,arr,inputs,outputs,done}) => {
    const ops = {
        1:(a,b,c) =>  { arr = arr.with(c,a+b); currInd+=4 },
        2:(a,b,c) =>  { arr = arr.with(c,a*b); currInd+=4 },
        3:(a)     =>  { arr = arr.with(a,inputs.shift()); currInd+=2 },
        4:(a)     =>  { outputs.push(a); currInd+=2 },
        5:(a,b)   =>  { a !== 0 ? currInd=b : currInd+=3 }, 
        6:(a,b)   =>  { a === 0 ? currInd=b : currInd+=3 }, 
        7:(a,b,c) =>  { arr[c] = a < b ? 1 : 0; currInd+=4 },
        8:(a,b,c) =>  { arr[c] = a === b ? 1 : 0; currInd+=4 },
        9:(a)     =>  { rBase += a; currInd+=2 }
    }

    while(`${arr[currInd]}`.slice(-2) !== '99' && (`${arr[currInd]}`.slice(-1) !== '3' || (`${arr[currInd]}`.slice(-1) === '3' && inputs.length>0))){
        
        let 
            ins = [c,b,a,_,op] = `${arr[currInd]}`.padStart(5,'0').split(''), 
            args
        
        if(op === '3'){
            a !== '2' ? args = [arr[currInd+1]] : args=[rBase+arr[currInd+1]]
        } else if (op === '4' || op === '9'){
            a === '0' ? args = [arr[arr[currInd+1]]] : a === '1' ? args=[arr[currInd+1]] : args=[arr[rBase+arr[currInd+1]]]
        } else {
            args = arr.slice(currInd+1, currInd+4).map((x,i)=>{
                if (i === 2){
                    return c === '2' ? x+rBase : x
                } else {
                    return [arr[x],x,arr[x+rBase]][+ins[2-i]]
                }
            })   
        }

        ops[op](...args)
    }
    
    return {'currInd':currInd,'rBase':rBase,'arr':arr,'inputs':inputs,'outputs':outputs,'done':`${arr[currInd]}`.slice(-2) === '99'}
}

let nextDir = ([r,c,dir],next) => {
    let turns = {
        'U':{0:'L',1:'R'},
        'D':{0:'R',1:'L'},
        'L':{0:'D',1:'U'},
        'R':{0:'U',1:'D'}
    }

    let dirs = {
        U:[r-1,c,'U'],
        D:[r+1,c,'D'],
        R:[r,c+1,'R'],
        L:[r,c-1,'L'],
    }

    return dirs[turns[dir][next]]
}

const solve = (partNo=1) => {
    let gridObj = {'0_0':partNo === 1 ? 0 : 1}
    let curr = [0,0,'U']
    let state = {
                currInd:0,
                rBase:0,
                arr:lines.slice().concat(Array(1000).fill(0)),
                inputs: partNo === 1 ? [0] : [1],
                outputs:[],
                done:false
            }
    while(!state.done){

        let nextState = runProgram(state)

        let [paint,nextD] = nextState.outputs

        gridObj[curr.slice(0,-1).join('_')] = paint

        curr = nextDir(curr,nextD)
        
        nextState.inputs = (gridObj?.[curr.slice(0,-1).join('_')]||0) === 0 ? [0] : [1]

        nextState.outputs = []

        state = nextState
    }

    return Object.entries(gridObj)
}

console.log(solve(1).length) // Part 1 answer

let gridObj = solve(2).map(([k,v])=>[k.split('_').map(Number),v])

let rowLen = Math.max(...gridObj.map((x)=>x[0][0]))
let colLen = Math.max(...gridObj.map((x)=>x[0][1]))

let grid = Array(rowLen+1).fill().map((x)=>Array(colLen+1).fill().map((y)=>' '))

gridObj.forEach(([[r,c],val])=> val === 0 ? grid[r][c] = ' ' : grid[r][c] = '#')

grid.forEach((x)=>console.log(x.join(''))) // Part 2 answer
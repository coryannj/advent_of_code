const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2017/day25.txt', {encoding: "utf8", flag: "r", });

const [ins, ...states] = input.replaceAll(/(right|left)/g,m=> m==='right' ? '1' : '-1').split(/\n\n/g)

const rules = Object.fromEntries(states.map((x)=>x.match(/([^.:\s]+)(?=[.:]?$)/gm).map((y)=>isNaN(y) ? y : parseInt(y))).map((x)=>{
    let id = x.shift()
    return [id,Object.fromEntries(x.chunks(4).map((y)=>[y[0],y.slice(1)]))]
}))

let
    vals = {},
    steps = +ins.match(/\d+/g)[0],
    currInd = 0,
    currState = 'A'

while(steps--){
    let [writeVal,move,nextState] = rules[currState][vals[currInd] || 0]
    vals[currInd]=writeVal
    currInd+=move
    currState = nextState
}

console.log(Object.values(vals).filter((x)=> x === 1).length)
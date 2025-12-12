const fs = require('fs');
const solver = require('javascript-lp-solver')
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day10.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/[\r\n]+/).map((x)=>x.match(/\S+/g))

let p1Min
let p1 = 0
let p2 = 0

const pressButtonsP1 = (startVal,buttons,target,count,lastbutton) => {
    if(count>10 || (p1Min !== undefined && count+1>=p1Min)) return null;

    if(buttons.some((x)=>(x^startVal) === target)) return count+1;

    let leastPresses = null

    for(const b of buttons.values()){
        if(b!==startVal){
            let nextVal = startVal^b
            let nextCount = pressButtonsP1(nextVal,buttons,target,count+1,b)
        
            if(nextCount !== null && (leastPresses === null || nextCount<leastPresses)){
                p1Min=nextCount
                leastPresses=nextCount
            }
        }
    }

    return leastPresses
}

lines.forEach((x,xi)=>{
    p1Min=undefined

    let buttons = x.slice(1,-1).map((y)=>y.match(/\d+/g).map(Number))
    
    let d = x[0].replaceAll('.','0').replaceAll('#','1').match(/\d/g).map(Number).join('')
    
    let dBinary = parseInt(d,2)

    let p1buttons = buttons.map((y)=>parseInt(Array(d.length).fill(0).map((z,zi) => y.includes(zi) ? 1 : 0).join(''),2))
    
    if(p1buttons.includes(dBinary)){
        p1+=1
    } else {
        p1+=pressButtonsP1(0,p1buttons,dBinary,0)
    }

    //Part 2 - with solving library sigh
    let joltage = x.at(-1).match(/\d+/g).map(Number)
    let p2buttons = buttons.map((x)=> Array(joltage.length).fill(0).map((y,yi)=> x.includes(yi) ? 1 : 0))

    
    let constraintsObj = Object.fromEntries(joltage.map((x,xi)=>[`joltage-${xi}`, {"min" : x, "max" : x } ]))

    let model = {
        optimize: 'presses',
        opType: 'min',
        constraints: constraintsObj,
        variables: {},
        ints: {}
    }

    buttons.map((x)=> Array(joltage.length).fill(0).map((y,yi)=> x.includes(yi) ? 1 : 0)).forEach((x,xi)=>{
  
        model['variables'][`button-${xi}`] = Object.fromEntries(x.map((y,yi)=>[`joltage-${yi}`,y]).concat([[`presses`,1]]))

        model['ints'][`button-${xi}`] = 1
    })

    let p2result = solver.Solve(model)

    p2+=p2result.result

})

console.log('Part 1 answer is ', p1)
console.log('Part 2 answer is ', p2)
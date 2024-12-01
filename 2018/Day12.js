const fs = require('fs');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

const numRegex = /([-]{0,1}\d+)/g

let lines = input.split(/\n\n/)

let state = lines[0].split(': ')[1].split('')
let rules = lines[1].split(/[\r\n]+/).map((x)=>x.split(' => ').map((y,yx)=>yx===0?y.split(''):y))

function oneGeneration(currState){
    let newstate = Array(currState.length).fill('.').map((x)=>x)
    for(i=2;i<currState.length-2;i++){
        let test = [currState[i-2],currState[i-1],currState[i],currState[i+1],currState[i+2]]
        let ruleMatch = rules.find(((x)=> x[0].every((y,yx,yarr)=>y ===test[yx])))
        if(ruleMatch !== undefined){
           newstate[i] = ruleMatch.at(-1)
        }
    }
    return newstate
}

function allGenerations(currState,numGen,p1orp2){
    let seen = []
    let seenCount = 0
    let result
    let potZeroIndex = 0
    let stateLen = currState.length
    let reps = numGen
    let lastScore
    let p2scoreDifference
    let p2lastScore
    while(reps>0){
        
        result = oneGeneration(['.','.','.','.','.'].concat(currState).concat(['.','.','.','.','.']))
        potZeroIndex+=5

        while(result[0]==='.' && potZeroIndex>0){
            result.shift()
            potZeroIndex--
        }
        
        while(result.length>stateLen && result.at(-1)==='.'){
            result.pop()
        }

        currState = result
        reps--

        if(p1orp2==='p2'){
            let trimregex = /^[^#]+/m
            let pattern = result.join(',').replace(trimregex,'')

            if(seen.includes(pattern)){
                seenCount++

                let resultTotal = result.map((x,ix)=> x === '#' ? ix-potZeroIndex : 0).reduce((acc,curr)=>acc+curr,0)

                if(seenCount>100 && (numGen-reps)%100 === 0){
                    p2scoreDifference = resultTotal-lastScore
                    p2lastScore = resultTotal
                    break;
                }

                lastScore = resultTotal

            } else {
                
                seen.push(pattern)
            
            }
        }
    }
    return p1orp2 === 'p1' ? [potZeroIndex,result] : [numGen-reps,p2scoreDifference,p2lastScore]
}

// Part 1
let p1state = state.slice()
let p1generations = 20
let [p1potZeroIndex,p1result] = allGenerations(p1state,p1generations,'p1')
let p1answer = p1result.map((x,ix)=> x === '#' ? ix-p1potZeroIndex : 0).reduce((acc,curr)=>acc+curr,0)
console.log('p1answer is ',p1answer)

// Part 2
let p2state = state.slice()
let p2generations = 1000
let [p2reps,p2scoreDifference,p2lastScore] = allGenerations(p2state,p2generations,'p2')
let p2answer = ((50000000000-p2reps)*p2scoreDifference)+p2lastScore
console.log('p2answer is ',p2answer)


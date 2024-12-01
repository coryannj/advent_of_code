const fs = require('fs');
const input = fs.readFileSync('../day16input.txt',{ encoding: 'utf8', flag: 'r' });

let alphabet = 'abcdefghijklmnopqrstuvwxyz';
let lines = input.split(',').map((x)=>[x[0],x.slice(1).split('/').map((y)=>alphabet.includes(y)?y:parseInt(y))]);
let programs = alphabet.slice(0,16).split('');

lines.forEach(([move,params])=>{
    if(move === 's'){
        let counter = params[0]
        while(counter>0){
            let a = programs.pop()
            programs.unshift(a)
            counter--
        }
    }

    if(move === 'x'){
        let A = programs[params[0]]
        let B = programs[params[1]]

        programs[params[0]] = B
        programs[params[1]] = A

    }

    if(move === 'p'){
        let indA = programs.indexOf(params[0])
        let indB = programs.indexOf(params[1])

        programs[indA] = params[1]
        programs[indB] = params[0]
        
    }
})

console.log(programs.join(''))

// Part 2
let counter = 0
let seen = [programs.join('')]
let seenIndexes = []

while(true){
    lines.forEach(([move,params])=>{
        if(move === 's'){
            let counter = params[0]
            while(counter>0){
                let a = programs.pop()
                programs.unshift(a)
                counter--
            }
        }
    
        if(move === 'x'){
            let A = programs[params[0]]
            let B = programs[params[1]]
    
            programs[params[0]] = B
            programs[params[1]] = A
    
        }
    
        if(move === 'p'){
            let indA = programs.indexOf(params[0])
            let indB = programs.indexOf(params[1])
    
            programs[indA] = params[1]
            programs[indB] = params[0]
            
        }
    })
    counter++

    let state = programs.join('')
    
    if(!seen.includes(state)){
        seen.push(state)

    } else {
        let stateInd = seen.indexOf(state)

        if(!seenIndexes.includes(stateInd)){
            seenIndexes.push(stateInd)
        } else {
            break
        }
    }
}
let remainder = 1000000000%seenIndexes.length
console.log(seen[remainder-1]) // Part 2 answer


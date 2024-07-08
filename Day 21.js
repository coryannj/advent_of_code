const fs = require('fs');
const input = fs.readFileSync('../day21input.txt',{ encoding: 'utf8' });
const numRegex = new RegExp(/\d+/, 'g');
const opRegex = new RegExp(/\s+/, 'g');

let jobs = input.split(/[\r\n]+/).map((x)=> {
    let [k,v] = x.split(':').map((y)=>y.trim())
    let vsplit = v.split(' ')
    if(vsplit.length>1){
        return [k,vsplit]
    } else {
        return [k,parseInt(vsplit[0])]
    }
})

//Part 1

let notNumbers = jobs.filter((x)=> typeof x[1] !== 'number')
let numbers = jobs.filter((x)=> typeof x[1] === 'number')

let jobDone = {}

numbers.forEach(([monkey,number])=>{
    jobDone[monkey] = number
})

while(jobDone['root']===undefined){
    
    let nowNumbers = notNumbers.filter(([monkey,[monkey1,operation,monkey2]])=> jobDone[monkey1]!==undefined && jobDone[monkey2]!==undefined).map(([monkey,[monkey1,operation,monkey2]])=>[monkey,[jobDone[monkey1],operation,jobDone[monkey2]]])
    
    nowNumbers.forEach(([monkeyKey,monkeyOp])=>{
        jobDone[monkeyKey] = eval(monkeyOp.join(' '))
    })
}

console.log(jobDone['root']) // Part 1

// Part 2
let p2notNumbers = jobs.filter((x)=> typeof x[1] !== 'number' && x[0] !== 'root')
let p2Numbers = jobs.filter((x)=> typeof x[1] === 'number' && x[0] !== 'humn')

let p2jobDone = {}

p2Numbers.forEach(([monkey,number])=>{
    p2jobDone[monkey] = number
})

let p2nowNumbers = p2notNumbers.filter(([monkey,[monkey1,operation,monkey2]])=> p2jobDone[monkey] === undefined && p2jobDone[monkey1]!==undefined && p2jobDone[monkey2]!==undefined).map(([monkey,[monkey1,operation,monkey2]])=>[monkey,[p2jobDone[monkey1],operation,p2jobDone[monkey2]]])

while(p2nowNumbers.length>0){
    p2nowNumbers.forEach(([monkeyKey,monkeyOp])=>{
        p2jobDone[monkeyKey] = eval(monkeyOp.join(' '))
    })

    p2nowNumbers = p2notNumbers.filter(([monkey,[monkey1,operation,monkey2]])=> p2jobDone[monkey] === undefined && p2jobDone[monkey1]!==undefined && p2jobDone[monkey2]!==undefined).map(([monkey,[monkey1,operation,monkey2]])=>[monkey,[p2jobDone[monkey1],operation,p2jobDone[monkey2]]])
    
}

let p2SomeNumbers = jobs.filter((x)=> typeof x[1] !== 'number' && x[0] !== 'root').filter(([monkey,[monkey1,operation,monkey2]])=> p2jobDone[monkey] === undefined).map(([monkey,[monkey1,operation,monkey2]])=>{
    let m1lookup = p2jobDone[monkey1] !== undefined ? p2jobDone[monkey1]:monkey1
    let m2lookup = p2jobDone[monkey2] !== undefined ? p2jobDone[monkey2]:monkey2
    return [monkey,[m1lookup,operation,m2lookup]]
})

let root = jobs.find((x)=>x[0]==='root')[1].filter((x,ix)=> ix!==1).map((y)=> p2jobDone[y] !== undefined ? p2jobDone[y]:y)

p2jobDone[root[0]] = root[1]

let queue = [root]

while(p2jobDone['humn'] === undefined){
    let [toSolveFor,value] = queue.shift()
    let equation = p2SomeNumbers.find(([monkey,[monkey1,operation,monkey2]])=> monkey===toSolveFor)[1]

    let operation = equation.splice(1,1)[0]
    let equationVariable = equation.find((x)=> typeof x !== 'number')
    let equationValue = equation.find((x)=> typeof x === 'number')

    let reverseOperation = {
        '+':'-',
        '-':'+',
        '*':'/',
        '/':'*'
    }

    let solveEquation

    if(operation === '*' || operation === '/'){
        solveEquation = eval([value,reverseOperation[operation],equationValue].join(' '))
    } else {
        if(equation.at(-1) === equationVariable){
            if(operation === '+'){
                solveEquation = eval([value,reverseOperation[operation],equationValue].join(' '))
            } else {
                solveEquation = eval([equationValue,operation,value].join(' '))
            }
        } else {
            if(operation === '+'){
                solveEquation = eval([value,reverseOperation[operation],equationValue].join(' '))
            } else {
                solveEquation = eval([value,reverseOperation[operation],equationValue].join(' '))
            }
        }
    }

    p2jobDone[equationVariable] = solveEquation
    queue.push([equationVariable,solveEquation])

}

console.log(p2jobDone['humn']) // Part 2 answer


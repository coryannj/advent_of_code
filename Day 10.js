const fs = require('fs');
const input = fs.readFileSync('../day10input.txt',{ encoding: 'utf8', flag: 'r' });
const pairRegex = /([(][)]|[\[][\]]|[{][}]|[<][>])/g
let lines = input.split(/[\r\n]+/)

let resultObj = {
    ')':3,
    ']':57,
    '}':1197,
    '>':25137
}

let illegal = []
let illegalIndex = []
let p1Lines = lines.slice().map((x)=>x.split(''))

p1Lines.forEach((line,lineIndex)=>{
    let openBracket = []
    let leftBracket = '({[<'
    let rightBracket = ')}]>'
    let queue = line
    let illegalchar = ''
    

    while (queue.length>0){
        let char = queue.shift()
        if(leftBracket.includes(char)){
            openBracket.push(char)
        }

        if(rightBracket.includes(char)){
            if(openBracket.at(-1)!==leftBracket[rightBracket.indexOf(char)]){
                illegalchar = char
                illegal.push(char)
                illegalIndex.push(lineIndex)
                break;
            } else {
                openBracket.pop()
            }
        }
    }
    
})

console.log(illegal.map((x)=>resultObj[x]).reduce((acc,curr)=>acc+curr)) // Part 1 result

let p2lines = lines.slice().filter((x,ix)=>!illegalIndex.includes(ix))

let p2Map = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4
}

let p2result = []

p2lines.forEach((line)=>{
    let newLine = line

    while(pairRegex.test(newLine)){
        let remove = newLine.replaceAll(pairRegex,'')
        newLine = remove
    }
    let pointValue = newLine.split('').reverse().map((x)=>p2Map[x])
    let result = 0

    for(i=0;i<pointValue.length;i++){
        let newResult = (result*5)+pointValue[i]
        result = newResult
    }

    p2result.push(result)
})
p2result.sort((a,b)=>a-b)
console.log(p2result.at(((p2result.length-1)/2))) // Part 2 result
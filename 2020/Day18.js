const fs = require('fs');
const input = fs.readFileSync('../day18input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/)

const bracketRegex = /([(](\d+|[*]|[+]|\s)+[)])/gm
const additionRegex = /(\d+\s*[+]\s*\d+)/mg

function expression(str,p1orp2){
    const addition = (add) => {
        return eval(add)
    }
    const evaluate = (s) => {
        if(p1orp2 === 'p2'){
            while(additionRegex.test(s)){
                s = s.replace(additionRegex,addition)
            }
        }

        let toEval = s.includes('(') ? s.slice(1,-1).split(' ') : s.split(' ')
        let first = toEval.shift()

        while(toEval.length>0){
            first = eval(`${first}${toEval.splice(0,2).join('')}`)
        }
        
        return first
    }
    
    let parse = str

    while(bracketRegex.test(parse)){
        parse = parse.replace(bracketRegex,evaluate)
    }

    return parseInt(evaluate(parse))
}

let p1Sum = 0
let p2Sum = 0

lines.forEach((line)=>{
    p1Sum += expression(line,'p1')
    p2Sum += expression(line,'p2')
})

console.log(p1Sum)
console.log(p2Sum)
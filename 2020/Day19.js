const fs = require('fs');
const input = fs.readFileSync('../day19input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\n/)
let check = lines[1].split(/[\r\n]+/)

// From https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
function* cartesian(head, ...tail) {
    const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
    for (let r of remainder) for (let h of head) yield [h, ...r];
}

const numRegex = /(\d+)/gm
const letterRegex = /([a-z]+)/gm

let rules = lines[0].split(/[\r\n]+/).map((x)=> x.split(/[:|]+/).map((y)=>y.trim())).map((x,ix)=>{
    return x.map((y,yx)=>{
        if(yx === 0){ 
            return y
        } else {
            if(numRegex.test(y)){
                return y.match(numRegex)
            } else {
                return y.match(letterRegex)
            }
        }
    })

})

let ruleObj = Object.fromEntries(rules.map((x)=>[x[0],[]]));
let base = rules.filter((x)=> x[1][0] === 'a'||x[1][0]==='b');
let others = rules.filter((x)=> x[1][0] !== 'a' && x[1][0] !== 'b');

let seen = new Set()

base.forEach(([id,[val]])=>{
    ruleObj[id].push(val)
    seen.add(id)
})

// Part 1
while(others.some((x)=> !seen.has(x[0]) && x.slice(1).flat().every((y)=>seen.has(y)))){
    let matching = others.filter((x)=> !seen.has(x[0]) && x.slice(1).flat().every((y)=>seen.has(y)))

    matching.forEach((x)=>{
        let id = x[0]
        let rules = x.slice(1).map((x)=> x.map((y)=>ruleObj[y].length === 1 ? ruleObj[y][0]:ruleObj[y])).map((x)=> x.every((y)=>typeof y === 'string') ? [x.join('')]:x)
        

        rules.forEach((rule)=>{
            if(rule.every((x)=>typeof x === 'string')){
                ruleObj[id] = ruleObj[id].concat(rule)
            } else {
                let combos = [...cartesian(...rule)].map((y)=>y.join(''))
                ruleObj[id] = ruleObj[id].concat([...new Set(combos)])
            }
        })
        seen.add(id)
    })
}

let valid = ruleObj[0]

let matchCount = 0
let matchIndex = []
let matches = []

check.forEach((c,cx)=>{
    if(valid.indexOf(c) >= 0){
        matchCount++
        matchIndex.push(cx)
        matches.push(c)
    }
})

console.log(matchCount) // Part 1 answer

// Part 2

// Rule 0: 8 11 - only rule referencing these
// New 8: 42 | 42 8 - repeating 42 (8 chars)
// New 11: 42 31 | 42 11 31 - repeating 42 (8 chars) followed by repeating 31 (8 chars)

let rule42 = ruleObj[42]
let rule31 = ruleObj[31]

let set42 = new Set(rule42)
let set31 = new Set(rule31)

// From https://stackoverflow.com/questions/8495687/split-array-into-chunks
function* chunks(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n);
    }
  }

// Check if each string length is multiple of 8
// Chunk into 8 chars and map to 42 or 31, if all 42 followed by 31, and no. of 42s > 31s then valid
let p2matches = 0
check.forEach((c)=>{
    if(c.length%8 === 0){
       let result =  [...chunks(c.split(''), 8)].map((x)=>{
            let str = x.join('')
            if(rule42.indexOf(str)>=0){
                return '42'
            } else if (rule31.indexOf(str)>=0){
                return '31'
            } else {
                return '__'
            }
        })

        let first42 = result.indexOf('42')
        let last42 = result.lastIndexOf('42')
        let first31 = result.indexOf('31')

        if(!result.includes('__') && first42<first31 && last42<first31){
            if(result.filter((x)=> x === '42').length>result.filter((x)=> x === '31').length){
                p2matches++
            }
        }
    }
})

console.log(p2matches) // Part 2 answer


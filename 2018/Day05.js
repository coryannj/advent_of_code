const fs = require('fs');
const input = fs.readFileSync('../day5input.txt',{ encoding: 'utf8', flag: 'r' });

let parse = input.split('')

let seen = [parse.shift()]

while(parse.length>0){
    if(seen.length === 0){
        seen.push(parse.shift())
    }

    if(seen.at(-1) !== parse[0] && seen.at(-1).toLowerCase()===parse[0].toLowerCase()){
        seen.pop()
        parse.shift()
    } else {
        seen.push(parse.shift())
    }
}

console.log(seen.length)

let alphabet2 = 'abcdefghijklmnopqrstuvwxyz'.split('')
let minLen2 = 1000000

alphabet2.forEach((letter)=>{
    let parse = input.split('').filter((x)=>x.toLowerCase()!==letter.toLowerCase())

    let seen = [parse.shift()]
    
    while(parse.length>0){
        if(seen.length === 0){
            seen.push(parse.shift())
        }
    
        if(seen.at(-1) !== parse[0] && seen.at(-1).toLowerCase()===parse[0].toLowerCase()){
            seen.pop()
            parse.shift()
        } else {
            seen.push(parse.shift())
        }
    }

    if(seen.length<minLen2){
        minLen2 = seen.length
    }
})
console.log(minLen2)
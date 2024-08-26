const fs = require('fs');
const input = fs.readFileSync('../day25input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map(Number).sort((a,b)=>a-b)

let value = 1
let subject = 7
let loop = 0
let result = []

while(value !== lines[1]){
    value = (value*7)%20201227;
    loop++

    if(value === lines[0]){
        result.push([value,loop])
    }
}

result.push([value,loop])

let dvalue = 1
let dsubject = result[0][0]
let dloop = 0

while(dloop<loop){
    dvalue = (dvalue*dsubject)%20201227;
    dloop++

}
console.log(dvalue)
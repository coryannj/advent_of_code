const fs = require('fs');
const input = fs.readFileSync('../day8input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(' '))

let registers = Object.fromEntries([...new Set(lines.flatMap((x)=>[x[0],x[4]]))].map((y)=>[y,0]))

let maxVal = 0

lines.forEach(([reg,change,changeVal,x,checkReg,checkOp,checkVal])=>{
    let check = eval([`registers['${checkReg}']`,checkOp,checkVal].join(' '))
    if(check){
        if(change === 'inc'){
            registers[reg]+=parseInt(changeVal)
        } else {
            registers[reg]-=parseInt(changeVal)
        }

        if(registers[reg]>maxVal){
            maxVal=registers[reg]
        }
    }
})

console.log(Object.values(registers).sort((a,b)=>b-a)[0])
console.log(maxVal)
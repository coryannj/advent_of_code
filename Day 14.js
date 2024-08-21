const { time } = require('console');
const fs = require('fs');
const input = fs.readFileSync('../day14input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\n]{0,1}(?=mask)/).map((x)=>x.split(/[\r\n]+/)).map((x)=> x.map((y)=>y.split(/[\r\n\W]+/)))

//Part 1
let memory = {}

lines.forEach((program)=>{
    let mask = program[0][1].split('')
    let write = program.slice(1)

    write.forEach(([mem,address,val])=>{
        let binary = Number(val).toString(2)
        let withMask = '0'.repeat(36-binary.length).concat(binary).split('').map((x,ix)=>mask[ix] !== 'X' ? mask[ix]:x).join('').replace(/^[0]+/m,'')
        memory[address] = parseInt(withMask,2)
        
    })
})

console.log(Object.values(memory).reduce((acc,curr)=>acc+curr,0))

//Part 2

// From https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
function* cartesian(head, ...tail) {
    const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
    for (let r of remainder) for (let h of head) yield [h, ...r];
}

let p2Memory = {}

lines.forEach((program)=>{
    let mask = program[0][1].split('')
    let write = program.slice(1)
    write.forEach(([mem,address,val])=>{
        let binary = Number(address).toString(2);
        let withMask = '0'.repeat(36-binary.length).concat(binary).split('').map((x,ix)=> mask[ix] === '0' ? x: mask[ix]).map((x)=> x === 'X' ? ['0','1']:[x]);
        let addresses = [...cartesian(...withMask)].map((x)=>parseInt(x.join('').replace(/^[0]+/m,''),2)).sort((a,b)=>a-b);
 
        addresses.forEach((addr)=>{
            p2Memory[addr] = parseInt(val)
        })
        
    })
})

console.log(Object.values(p2Memory).reduce((acc,curr)=>acc+curr,0)) // Part 2 answer
const fs = require('fs');
const input = fs.readFileSync('../day15input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\n/)

let fields = lines[0].split(/[\r\n]+/).map((x)=>x.match(/\d+[-]\d+/g).map((y)=>y.split('-').map(Number)));
let fieldnames = lines[0].split(/[\r\n]+/).flatMap((x)=>x.match(/^\w+/gm));
let yourTicket = lines[1].split(/[\r\n]+/).slice(1).map((x)=>x.split(',').map(Number));

// Part 1
 let restTickets = lines[2].split(/[\r\n]+/).slice(1).map((x)=>x.split(',').map(Number))
console.log(restTickets.flatMap((x)=> x.filter((y)=> {
    return fields.flat().every(([min,max])=> y<min || y>max)
})).reduce((acc,curr)=>acc+curr)) // Part 1 answer

// Part 2
let validTickets = restTickets.filter((x)=>{
    let notValid = x.some((y)=> fields.flat().every(([min,max])=> y<min || y>max))

    return !notValid
})

validTickets.push(yourTicket[0]);
let ticketLength = validTickets[0].length;
let minMax = [];

for(i=0;i<ticketLength;i++){
    let vals = validTickets.flatMap((x)=> x[i])

    let fieldIndex = fields.map((x,ix,arr)=> {        
       return vals.every((val)=> x.some(([min,max])=>min<=val && val<=max))
    }).map((y,yx)=> y === true ? yx : '').filter((z)=> typeof z === 'number')

    minMax.push([i,fieldIndex])

}

let fieldOrder = Array(fieldnames.length).fill('.').map((x)=>'')
let assigned = []

minMax.sort((a,b)=>a[1].length-b[1].length).forEach(([position,fields])=>{
    let field = fields.filter((x)=> !assigned.includes(x)).at(-1)
    assigned.push(field)
    fieldOrder[position] = fieldnames[field]
})

console.log(fieldOrder.map((x,ix)=> x === 'departure' ? yourTicket[0][ix]:x).filter((y)=>typeof y === 'number').reduce((acc,curr)=>acc*curr,1)) // Part 2 answer
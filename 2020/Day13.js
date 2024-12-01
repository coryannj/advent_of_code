const { time } = require('console');
const fs = require('fs');
const input = fs.readFileSync('../day13input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/)

// Part 1
let startTime = parseInt(lines[0])
let departTime = startTime
let buses = lines[1].split(',').filter((z)=> z !== 'x').map(Number)

while(!buses.some((x)=>departTime%x === 0)){
    departTime++
}

let busId = buses.find((x)=>departTime%x === 0)
console.log((departTime-startTime)*busId) // Part 1 answer

//Part 2

let p2buses = lines[1].split(',').map((x,ix)=>[ix,parseInt(x)]).filter(([x,y])=> !isNaN(y)).map((x,ix)=> {
    if(ix === 0){
        return x
    } else {
        if(x[1]>x[0]){
            return [x[1]-x[0],x[1]]
        } else {
            return [x[1]-(x[0]%x[1]),x[1]]
        }
    }
})

// Chinese remainder theorem
let lcm = BigInt(p2buses.map((x)=>x[1]).reduce((acc,curr)=>acc*curr,1))
let crt = p2buses.map(([remainder,mod])=>[BigInt(remainder),BigInt(mod)]).map(([remainder,mod])=>{

    let Ni = lcm/mod;
    let inv = Ni%mod;

    if(inv !== 1n){
        let x = BigInt(1)
        while((inv*x)%mod !== 1n){
            x+=BigInt(1)
        }
        inv = x
    }
    
    return remainder*Ni*inv

})
let sum = crt.reduce((acc,curr)=>acc+curr)

console.log(sum%lcm) // Part 2 answer

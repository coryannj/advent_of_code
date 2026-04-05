const { sign } = require('crypto');
const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day19.txt', {encoding: "utf8", flag: "r", });

let [m,r] = input.split(/\n\n/)

m = m.split(/\n/g).map((x)=>x.split(' => '))

const machine = Object.fromEntries([...new Set(m.map((x)=>x[0]))].map((id)=>[id,m.filter(([id1,val1])=>id1 === id).map((y)=>y[1])]))

r = r.split('')

let
    seen = '',
    allR = new Set()

while(r.length){
    while(r.length && machine[r[0]]||machine[r[0]+r[1]]){
        let k = r.shift()

        if(!machine[k]) k+=r.shift()

        machine[k].forEach((x)=>allR.add(seen+x+r.join('')))
        seen+=k
    }
        
    let notMachine = ''

    while(r.length && !machine[r[0]]&&!machine[r[0]+r[1]]){
        notMachine+=r.shift()
    }

    seen+=notMachine
}

console.log(allR.size) // Part 1

// Part 2 - had to take formula from https://gist.github.com/icub3d/29ffb11397e9866e83e2269ef61f0684 - naive replacement didn't work
let p2 = seen

let ms = p2.split('').filter((x)=>x===x.toUpperCase()).length
let rn = p2.match(/(Rn)/g).length
let ar = p2.match(/(Ar)/g).length
let y = p2.match(/(Y)/g).length

console.log(ms-rn-ar-(y*2)-1) // Part 2
const fs = require('fs');
const input = '925176834'

let lines = input.split('').map(Number)
let cupMin = Math.min(...lines)

// Part 1
let cups = lines.slice()
let turns = 100
let current

while (turns>0){
    current = cups.shift()
    let pickup = cups.slice(0,3)
    let afterPickup = cups.slice(3)
    let destination = current>cupMin ? Array(current-cupMin).fill(current-1).map((x,ix)=>x-ix).find((x)=> afterPickup.includes(x)) : -1

    if (destination === undefined || destination === -1){
        destination = Math.max(...afterPickup)
    } 

    let destIndex = afterPickup.indexOf(destination)
    afterPickup.splice(destIndex+1,0,...pickup)

    let newCups = afterPickup.concat([current])
    cups = newCups

    turns--
}

let oneIndex = cups.indexOf(1)

if(oneIndex === 0){
    console.log('Part 1 answer is ',cups.slice(1).join(''))
} else {
    let beforeOne = cups.slice(0,oneIndex)
    let afterOne = cups.slice(oneIndex+1)
    console.log('Part 1 answer is ',afterOne.concat(beforeOne).join(''))
}

// Part 2

let p2Cups = lines.slice()
let cupMap = p2Cups.map((x,ix,arr)=> ix<p2Cups.length-1 ? [x,arr[ix+1]]:[x,''])

let last = cupMap.pop();
let cupList = new Map(cupMap);

for(i=10;i<=999999;i++){
cupList.set(i,i+1)
}

cupList.set(last[0],10);
cupList.set(1000000,p2Cups[0]);

let p2curr = p2Cups[0]

function arrangeCups(curr){
    let removal = [cupList.get(curr)]
    removal.push(cupList.get(removal[0]))
    removal.push(cupList.get(removal[1]))
    
    let next = cupList.get(removal[2])
    let dest = [curr-1,curr-2,curr-3,curr-4]
    let max = [1000000,999999,999998,999987]
    let destination = dest.filter((x)=>x>0).concat(max).find((y)=> !removal.includes(y))
    let destnext = cupList.get(destination)

    cupList.set(curr,next)
    cupList.set(destination,removal[0])
    cupList.set(removal[2],destnext)

    return next
}

for(j=10000000;j>0;j--){
    let turn = arrangeCups(p2curr)
    p2curr = turn
}

let answer = cupList.get(1)
console.log('Part 2 answer is ',answer*cupList.get(answer)) 
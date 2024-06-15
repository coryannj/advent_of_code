const fs = require('fs');
const input = fs.readFileSync('../day10input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>{
    let split = x.split(' ')
    if (split.length === 1){
        return split
    } else {
        return [split[0],parseInt(split[1])]
    }
})

// Part 1
let allCycles = [20,60,100,140,180,220]
let results = 0

function getStrength(noOfCycles){
    let startIndex = 0
    let cycles = 1
    let x = 1
    let lastx
    do {
        let instruction = lines[startIndex]
        startIndex++
        if (instruction.length > 1){
            cycles+=2
            x+=instruction[1]
            lastx = instruction[1]
        } else {
            cycles++
        }
    
    } while (cycles<noOfCycles)

    if (cycles>noOfCycles){
        x-=lastx
        cycles--
    }
    return cycles*x
}

allCycles.forEach((el)=>{
    results += getStrength(el)
})

console.log(results) // Part 1 answer

// Part 2
let crt = Array(6).fill('.').map((x)=> x.repeat(40).split(''))
let crtIndex = 0
let spritePosition = [0,1,2]

lines.forEach((instruction)=> {
    
    let cyclesToRun = instruction.length === 1 ? 1 : 2;

    for(i=0;i<cyclesToRun;i++){
        let rowIndex = Math.floor(crtIndex/40);
        let crtRowIndex = (crtIndex - rowIndex)%39
        if (spritePosition.includes(crtRowIndex)){
            crt[rowIndex][crtRowIndex] = '#'
        }
        crtIndex++
    }

    if (instruction.length === 2) {
        let newSpritePosition = spritePosition[1]+instruction[1]
        spritePosition = [newSpritePosition-1,newSpritePosition,newSpritePosition+1]
    }
})

console.log(crt.map((x)=> x.join(''))) // Part 2 answer

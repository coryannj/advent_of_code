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

// For Part 1
let allCycles = [20,60,100,140,180,220]
let p1result = 0
let xposition = 1

// For Part 2
let crt = Array(6).fill('.').map((x)=> x.repeat(40).split(''))
let crtIndex = 0
let spritePosition = [0,1,2]

lines.forEach((instruction)=> {
    
    let cyclesToRun = instruction.length === 1 ? 1 : 2;
    
    for(i=0;i<cyclesToRun;i++){
        // Part 2
        let rowIndex = Math.floor(crtIndex/40);
        let crtRowIndex = (crtIndex - rowIndex)%39;
        if (spritePosition.includes(crtRowIndex)){
            crt[rowIndex][crtRowIndex] = '#';
        }
        crtIndex++

        // Part 1
        if (allCycles.includes(crtIndex)){
            p1result+=(crtIndex*xposition)
        }
    }

    if (instruction.length === 2) {
        
        xposition+=instruction[1]; // Part 1

        let newSpritePosition = spritePosition[1]+instruction[1]; // Part 2
        spritePosition = [newSpritePosition-1,newSpritePosition,newSpritePosition+1];
    }

})

console.log(p1result) // Part 1 answer
console.log(crt.map((x)=> x.join(''))) // Part 2 answer


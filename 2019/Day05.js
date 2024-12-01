const fs = require('fs');
const input = fs.readFileSync('../day5input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(',').map(Number)
console.log(Number('02'))

let program = lines.slice()
program[1] = 12
program[2] = 2

let currIndex = 0

while(program[currIndex]!==99){
    let [opCode,input1,input2,output] = program.slice(currIndex,currIndex+5)
        
    if(opCode === 1){
        program[output] = program[input1]+program[input2]
    } else if (opCode === 2) {
        program[output] = program[input1]*program[input2]
    } else if (opCode === 3) {

    } else {
        //opCode === 4
    }
    currIndex+=5
}

console.log('Part 1 answer is ',program[0])

function causeOutput(noun,verb){
    let p2program = lines.slice()
    p2program[1] = noun
    p2program[2] = verb

    let currIndex = 0

    while(p2program[currIndex]!==99){
        let [opCode,input1,input2,output] = p2program.slice(currIndex,currIndex+4)
            
        if(opCode === 1){
            p2program[output] = p2program[input1]+p2program[input2]
        } else {
            p2program[output] = p2program[input1]*p2program[input2]
        }
        currIndex+=4
    }

    return p2program[0]
}

let thisOutput

p2:
for(i=0;i<100;i++){
    for(j=0;j<100;j++){
        thisOutput = causeOutput(i,j)
        if(thisOutput===19690720){
            console.log('Part 2 answer is ',(100*i)+j)
            break p2;
        }
    }
}
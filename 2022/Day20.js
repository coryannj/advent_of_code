const fs = require('fs');
const input = fs.readFileSync('../day20input.txt',{ encoding: 'utf8' });

let fileOriginal = input.split(/[\r\n]+/).map(Number).map((x,ix)=>[x,ix])
let mixLength = fileOriginal.length

function mixFile(mixes,p1orp2){
    let file = fileOriginal.slice().map(([num,numidx])=> {
        if(p1orp2 === 'p1'){
            return [num,numidx]
        } else {
            return [num*811589153,numidx]
        }
    })
    
    let fileLength = fileOriginal.length
    let grove = [1000,2000,3000]

    for(i=0;i<mixes;i++){
        let moveIndex = 1
        let fileIndex = 0
        while (moveIndex<=fileLength){
            let [number,originalInd] = file.find(([x,ix])=>ix === fileIndex%fileLength)
            let currentInd = file.findIndex(([x,ix])=>ix === fileIndex%fileLength)
        
            if(number !== 0){
                let newLength = fileLength-1
                let steps = number%newLength
                let newInd = currentInd+steps

                if(steps !== 0){
                    if(newInd < 0){
                        newInd += newLength
                    } else if (newInd > newLength){
                        newInd -= newLength 
                    } 

                    file.splice(currentInd,1)
                    file.splice(newInd,0,[number,originalInd])
                }
            }
    
            moveIndex++
            fileIndex++
        }
    }

    let indexOfZero = file.findIndex((x)=>x[0]===0)
    return grove.map((x,ix)=>file[(indexOfZero+x)%fileLength][0]).reduce((acc,curr)=>acc+curr)
}

console.log(mixFile(1,'p1')) // Part 1 answer
console.log(mixFile(10,'p2')) // Part 2 answer
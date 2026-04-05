const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day24.txt', {encoding: "utf8", flag: "r", });

let nums = input.split(/\n/g).map(Number).sort((a,b)=>b-a)

const solve = (partNo) => {
    let size = nums.reduce((a,c)=>a+c)/(partNo === 1 ? 3 : 4)
    let minLen = nums.findIndex((x,i,a)=>a.slice(0,i+1).reduce((acc,c)=>acc+c)>=size)
    
    function* cartesian(head, ...tail) {
        const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
        for (let r of remainder){
            for (let h of head){
                let result = [h, ...r];
                if(!result.length || result.length<minLen+1){
                    yield result
                } else {
                    if(new Set(result).size === minLen+1){
                        yield result
                    }
                }
            } 
        } 
    }

    let sets = cartesian(...Array(minLen+1).fill().map((x)=>nums.slice())).filter((x)=> x.reduce((a,c)=>a+c) === size || nums.some((y)=> !x.includes(y) && y + x.reduce((a,c)=>a+c) === size))

    let currVal = sets.next()
    let min = Infinity

    do{
        let total = size-currVal.value.reduce((a,c)=>a+c)
        let QE = currVal.value.concat(Math.max(1,total)).reduce((a,c)=>a*c,1)
        if(QE<min) min = QE
        currVal = sets.next()
    } while (!currVal.done)

    return min
}

console.log(solve(1))
console.log(solve(2))
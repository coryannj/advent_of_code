const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2019/day05.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(',').map(Number)

const solve = (arr,inputVal) => {
    let currInd = 0
    //arr=arr.with(1,noun).with(2,verb)
    let output

    const ops = {
        1:(aPos,bPos,a,b,c) => arr = arr.with(c,(aPos === 0 ? arr[a] : a)+(bPos === 0 ? arr[b] : b)),
        2:(aPos,bPos,a,b,c) => arr = arr.with(c,(aPos === 0 ? arr[a] : a)*(bPos === 0 ? arr[b] : b)),
        3:(c) => arr = arr.with(c,inputVal),
        4:(c) => output = arr[c],
        5:(aPos,bPos,a,b) =>currInd = (aPos === 0 ? arr[a] : a) !== 0 ? (bPos === 0 ? arr[b] : b) : currInd+3, 
        6:(aPos,bPos,a,b) =>currInd = (aPos === 0 ? arr[a] : a) === 0 ? (bPos === 0 ? arr[b] : b) : currInd+3, 
        7:(aPos,bPos,a,b,c) => arr[c] = (aPos === 0 ? arr[a] : a)<(bPos === 0 ? arr[b] : b) ? 1 : 0,
        8:(aPos,bPos,a,b,c) => arr[c] = (aPos === 0 ? arr[a] : a)===(bPos === 0 ? arr[b] : b) ? 1 : 0,

    }

    while(`${arr[currInd]}`.slice(-2) !== '99'){
        let op = `${arr[currInd]}`.padStart(5,'0').split('')
        let [a,b,c] = op.splice(0,3)

        if('34'.includes(op[1])){
            let arg = arr[currInd+1]
            ops[op[1]](arg)
            currInd+=2
        } else if('56'.includes(op[1])){
            let args = arr.slice(currInd+1,currInd+3)
            ops[op[1]](+c,+b,...args)
        } else {
            let args = arr.slice(currInd+1,currInd+4)
            ops[op[1]](+c,+b,...args)
            currInd+=4
        }
    }
    
    return output
}

console.log(solve(lines,1))
console.log(solve(lines,5))
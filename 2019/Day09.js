const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2019/day09.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(',').map(Number)

const runProgram = ({currInd,rBase,arr,inputs,outputs,done}) => {
    const ops = {
        1:(a,b,c) =>  { arr = arr.with(c,a+b); currInd+=4 },
        2:(a,b,c) =>  { arr = arr.with(c,a*b); currInd+=4 },
        3:(a)     =>  { arr = arr.with(a,inputs.shift()); currInd+=2 },
        4:(a)     =>  { outputs = [a]; currInd+=2 },
        5:(a,b)   =>  { a !== 0 ? currInd=b : currInd+=3 }, 
        6:(a,b)   =>  { a === 0 ? currInd=b : currInd+=3 }, 
        7:(a,b,c) =>  { arr[c] = a < b ? 1 : 0; currInd+=4 },
        8:(a,b,c) =>  { arr[c] = a === b ? 1 : 0; currInd+=4 },
        9:(a)     =>  { rBase += a; currInd+=2 }
    }

    while(`${arr[currInd]}`.slice(-2) !== '99' && (`${arr[currInd]}`.slice(-1) !== '3' || (`${arr[currInd]}`.slice(-1) === '3' && inputs.length>0))){
        
        let 
            ins = [c,b,a,_,op] = `${arr[currInd]}`.padStart(5,'0').split(''), 
            args
        
        if(op === '3'){
            a !== '2' ? args = [arr[currInd+1]] : args=[rBase+arr[currInd+1]]
        } else if (op === '4' || op === '9'){
            a === '0' ? args = [arr[arr[currInd+1]]] : a === '1' ? args=[arr[currInd+1]] : args=[arr[rBase+arr[currInd+1]]]
        } else {
            args = arr.slice(currInd+1, currInd+4).map((x,i)=>{
                if (i === 2){
                    return c === '2' ? x+rBase : x
                } else {
                    return [arr[x],x,arr[x+rBase]][+ins[2-i]]
                }
            })   
        }

        ops[op](...args)
    }
    
    return {'currInd':currInd,'rBase':rBase,'arr':arr,'inputs':inputs,'outputs':outputs,'done':`${arr[currInd]}`.slice(-2) === '99'}
}

const solve = (iVal=[]) => {

    let baseObj = {
                currInd:0,
                rBase:0,
                arr:lines.slice().concat(Array(1000).fill(0)),
                inputs: iVal,
                outputs:[],
                done:false
            }

    return runProgram(baseObj)
}

console.log(solve([1]).outputs[0])
console.log(solve([2]).outputs[0])
const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2019/day07.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(',').map(Number)

const runProgram = ({currInd,arr,inputs,outputs,done}) => {
    const ops = {
        1:(a,b,c) =>  { arr = arr.with(c,a+b); currInd+=4 },
        2:(a,b,c) =>  { arr = arr.with(c,a*b); currInd+=4 },
        3:(a)     =>  { arr = arr.with(a,inputs.shift()); currInd+=2 },
        4:(a)     =>  { outputs = [arr[a]]; currInd+=2 },
        5:(a,b)   =>  { a !== 0 ? currInd=b : currInd+=3 }, 
        6:(a,b)   =>  { a === 0 ? currInd=b : currInd+=3 }, 
        7:(a,b,c) =>  { arr[c] = a < b ? 1 : 0; currInd+=4 },
        8:(a,b,c) =>  { arr[c] = a === b ? 1 : 0; currInd+=4 },
    }

    while(`${arr[currInd]}`.slice(-2) !== '99' && (`${arr[currInd]}`.slice(-1) !== '3' || (`${arr[currInd]}`.slice(-1) === '3' && inputs.length>0))){
        
        let ins = [c,b,a,_,op] = `${arr[currInd]}`.padStart(5,'0').split('')

        let args = '34'.includes(op) ? [arr[currInd+1]] : arr.slice(currInd+1,currInd+4).map((x,i)=> i === 2 ? x : ins[2-i] === '0' ? arr[x] : x)

        ops[op](...args)
    }
    
    return {'currInd':currInd,'arr':arr,'inputs':inputs,'outputs':outputs,'done':`${arr[currInd]}`.slice(-2) === '99'}
}

function* cartesian(head, ...tail) {
  const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
  for (let r of remainder) for (let h of head) yield [h, ...r];
}

const solve = (pStart,n) => {
    let phaseCombos = cartesian(...Array(n).fill().map((x)=>Array(n).fill(pStart).map((x,i)=>x+i))).filter((x)=>new Set(x).size === n)

    let max = 0

    for(const p of phaseCombos){
        let amps = p.map((x,i)=>{
            return {
                currInd:0,
                arr:lines.slice(),
                inputs: i === 0 ? [x,0] : [x],
                outputs:[],
                done:false
            }
        })

        while(!amps.at(-1).done){
            amps = amps.reduce((a,c)=>{
                c.inputs = c.inputs.concat(a.at(-1).outputs)
                return a.concat(runProgram(c))
            },[runProgram(amps.shift())])

            if(!amps.at(-1).done) amps[0].inputs = amps[0].inputs.concat(amps.at(-1).outputs)
        }

        max = Math.max(max,amps.at(-1).outputs[0])
    }

    return max
    
}
console.log(solve(0,5))
console.log(solve(5,5))
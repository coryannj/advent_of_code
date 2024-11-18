const fs = require('fs');
const input = fs.readFileSync('../day18input.txt',{ encoding: 'utf8', flag: 'r' });

let alphabet = 'abcdefghijklmnopqrstuvwxyz'
let lines = input.split(/[\r\n]+/).map((x)=>x.split(' ')).map((x,ix)=>[ix,x[0],x.slice(1).map((y)=>alphabet.includes(y)?y:parseInt(y))])

// Part 1
let registers = {}
let lastFreq
let recovers
let nextInd = 0

while(nextInd>=0 && nextInd<lines.length){

    let [ind,inst,params] = lines[nextInd],param2

    if(inst !== 'snd' && inst !== 'rcv'){
        param2 = alphabet.includes(params[1]) ? registers[params[1]] : params[1]
    }
    
    if(registers[params[0]]===undefined){
        registers[params[0]]=0
    }

    if(inst === 'jgz' && registers[params[0]] !== 0){
        if(ind+param2>=0 && ind+param2< lines.length){
            nextInd = ind+param2
        } else {
            break;
        }
    } else {
        if(nextInd<lines.length-1){
            nextInd++
        } else {
            break;
        }
    }
    
    if(inst === 'set'){
        registers[params[0]] = param2
        continue;
    }

    if(inst === 'add'){
        registers[params[0]]+=param2
        continue;
    }
    if(inst === 'snd'){
        lastFreq = registers[params[0]]
        continue;
    }

    if(inst === 'mul'){
        registers[params[0]]*=param2
        continue;
    }

    if(inst === 'mod'){
        registers[params[0]]%=param2
        continue;
    }

    if(inst === 'rcv'){
        if(registers[params[0]] !== 0) recovers = lastFreq

        if(recovers !== undefined){
            break;
        }
    }
}

console.log(recovers)

// Part 2
let p0  = [0,0,{p:0}]
let p1 = [1,0,{p:1}]
let prog0 = []
let prog1 = []
let p0wait = false
let p1wait = false
let p1send = 0
let p1nochange = 0

function part2([progNo,nextInd,registers]){
    p1nochange++
    let [ind,inst,params] = lines[nextInd],param2

    if(alphabet.includes(params[0]) && registers[params[0]]===undefined){
        registers[params[0]]=0
    }

    if(inst !== 'snd' && inst !== 'rcv'){
        param2 = alphabet.includes(params[1]) ? registers[params[1]] : params[1]
    }
    
    if(inst === 'snd'){
        let sndparam = alphabet.includes(params[0]) ? registers[params[0]] : params[0]
        if(progNo === 0){
            prog1.push(sndparam)
            p1wait = false
        } else {
            prog0.push(sndparam)
            p0wait = false
            p1send++
            p1nochange=0
        }
    }

    if(inst === 'rcv'){
       if(progNo === 0) {
            if(prog0.length === 0){
                if(p1wait){
                    return true
                } else {
                    p0wait = true
                    return [progNo,nextInd,registers]
                }                
            } else {
                p0wait = false
                registers[params[0]] = prog0.shift()
            }
       } else {
            if(prog1.length === 0){
                if(p0wait){
                    return true
                } else {
                    p1wait = true
                    return [progNo,nextInd,registers]
                }                
            } else {
                p1wait = false
                registers[params[0]] = prog1.shift()
            }
       }
    }

    let jgzParam = alphabet.includes(params[0]) ? registers[params[0]] : params[0]

    if(inst === 'jgz' && jgzParam > 0){
        if(ind+param2>=0 && ind+param2< lines.length){
            nextInd = ind+param2
        } else {
            return true
        }
    } else {
        if(nextInd<lines.length-1){
            nextInd++
        } else {
            return true
        }
    }

    if(inst === 'mul'){
        registers[params[0]]*=param2
    }

    if(inst === 'mod'){
        registers[params[0]]%=param2
    }
    if(inst === 'set'){
        registers[params[0]] = param2
    }

    if(inst === 'add'){
        registers[params[0]]+=param2
    }

    return [progNo,nextInd,registers]
}

do{
    if(p0 !== true && !p0wait){
        p0 = part2(p0)
    }

    if(p1 !== true && !p1wait){
        p1 = part2(p1)
    }
} while (p0 !== true && p1 !== true)

console.log(p1send)
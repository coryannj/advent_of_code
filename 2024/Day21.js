const { on } = require("events");
const fs = require("fs");
require("../utils.js");
const { codes } = require('../inputs/2024/day21.js') // Array of hardcoded numeric keypad dirs e.g. for example ['<A^A>^^AvvvA', ...] - I do not feel the tiniest bit bad about this :-D
const input = fs.readFileSync('../inputs/2024/day21.txt', {encoding: "utf8", flag: "r", });
const keypadCodes = input.lines();

const dirs = {
    '<':'v<<A',
    '^':'<A',
    'v':'<vA',
    '>':'vA',
    'A':'A',
    '<^':'>^A',
    '<v':'>A',
    '<>':'>>A',
    '<A':'>>^A',
    '^<':'v<A',
    '^v':'vA',
    '^>':'v>A', 
    '^A':'>A',
    'v<':'<A',
    'v^':'^A',
    'v>':'>A',
    'vA':'^>A',
    '><':'<<A',
    '>v':'<A',
    '>^':'<^A',
    '>A':'^A',
    'A<':'v<<A',
    'A^':'<A',
    'Av':'v<A',
    'A>':'vA',
    '<<':'A',
    'vv':'A',
    '^^':'A',
    '>>':'A',
    'AA':'A'
}

const minPresses = (keypadCodes,dircodes,keyboards) => {
    let keypadNums = keypadCodes.map((x)=>parseInt(x.slice(0,-1)))
    let targetDepth = keyboards-1
    let result = 0

    for (const [index,code] of dircodes.entries()) {
        let countObj = code.replaceAll('A','A ').split(' ').slice(0,-1).counts()
    
        for(i=0;i<targetDepth;i++){
            let newCountObj = {}
            for(const [key,val] of Object.entries(countObj)){
                if(key.length === 1){
                    let newKey = dirs[key]
    
                    newCountObj[newKey] ? newCountObj[newKey]+=val : newCountObj[newKey] = val
                } else {
                    let keySplit = [''].concat(key.split('')).map((x,ix,arr)=>`${x}${arr[ix+1]}`).slice(0,-1);

                    keySplit.forEach((sKey)=>{
                        let newKey = dirs[sKey]
                        newCountObj[newKey] ? newCountObj[newKey]+=val : newCountObj[newKey] = val
                    })
                }
            }
            countObj = newCountObj
        }
    
        result += (Object.entries(countObj).map(([k,v])=>k.length*v).sum()*keypadNums[index])

    }
    return result
}

const t0 = performance.now();
let p1 = minPresses(keypadCodes,codes,3);
const t1 = performance.now();

let p2 = minPresses(keypadCodes,codes,26);
const t2 = performance.now();

console.log('Part 1 answer is ',p1,t1-t0,'ms')
console.log('Part 2 answer is ',p2,t2-t1,'ms')
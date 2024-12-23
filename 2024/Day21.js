const { on } = require("events");
const fs = require("fs");
require("../utils.js");
const { codes } = require('../inputs/2024/day21.js') // Array of hardcoded numeric keypad dirs e.g. for example ['<A^A>^^AvvvA', ...] - I do not feel the tiniest bit bad about this :-D
const input = fs.readFileSync('../inputs/2024/day21.txt', {encoding: "utf8", flag: "r", });
const keypadCodes = input.lines();

const keypad = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [null, '0', 'A'],
]




const allShortest = (start,grid) => {
    let pathsObj = {}
    let seen = new Set()
    seen.add(start.join('|'))
    let startVal = grid[start[0]][start[1]]
    let queue = [[[start,'',startVal]]]

    const nextStep = ([r,c],grid) => {
        return [[r-1,c,'^'],[r,c+1,'>'],[r+1,c,'v'],[r,c-1,'<']].filter(([nr,nc,nd])=>grid?.[nr]?.[nc] !== undefined && !seen.has(`${nr}|${nc}`) && !!grid?.[nr]?.[nc]).map(([nr,nc,nd])=>[[nr,nc],nd].concat(grid[nr][nc]))
    }
    //let next = nextStep(start,grid)
    
    console.log('queue is ',queue)

    while(queue.length>0){
        let nextQueue = []
        let queueSeen = []

        queue.forEach((path)=>{
            //console.log('queue x is ',path)
            let last = [point,dir,val] = path.at(-1)
            //console.log('last is ',last)

            let next = nextStep(point,grid)
            //console.log('next is ',next)

            next.forEach(([np,nd,nv])=>{
                queueSeen.push(np.join('|'))
                let newPath = path.concat([[np,nd,nv]])
                pathsObj[nv] ? pathsObj[nv].push(newPath) : pathsObj[nv] = [newPath]
                //console.log('pathobj',nv,' is ',pathsObj[nv])
                nextQueue.push(newPath)
//newCountObj[newKey] ? newCountObj[newKey]+=val : newCountObj[newKey] = val

            })
            
        })
        queueSeen.forEach((x)=>seen.add(x))
        queue = nextQueue
        console.log('queue is now ',queue)
        console.log('seen is now ',seen)
    }

    return pathsObj
}

let pathsObj = allShortest([3,2],keypad)

Object.keys(pathsObj).forEach((x)=>console.log('x is ',x,pathsObj[x]))


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
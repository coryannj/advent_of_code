const fs = require('fs');
const { before } = require('node:test');
const input = fs.readFileSync('../day18input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/[\r\n]+/)

const pairregex = /(^[\[]\d+[,]\d+[\]])/m
const splitregex = /(\d{2})/
const beforenumregex = /(\d+)(?=\D*$)/m
const afternumregex = /(?<=^[\[]\d+[,]\d+[\]]\D*)(\d+)/m

function explodeNum(str,arr,leftright){
    let dirregex = leftright === 'left' ? beforenumregex : afternumregex;
    let valToAdd = leftright === 'left' ? arr[0] : arr [1];

    const addVals = (s) => `${parseInt(s)+valToAdd}`;
    return leftright === 'left' ? str.replace(dirregex,addVals) : str.replace(dirregex,addVals).replace(JSON.stringify(arr),'0')
}

function split(str){
    const splitAdd = (s) => JSON.stringify([Math.floor(parseInt(s)/2),Math.ceil(parseInt(s)/2)])
    return str.replace(splitregex,splitAdd)
}

function magAdd(str) {
    const magSum = (s) => `${(3*JSON.parse(s)[0])+(2*JSON.parse(s)[1])}`
    return str.replace(/([\[]\d+[,]\d+[\]])/,magSum)
}

function magnitude(str){
        let m = magAdd(str)

        if(!m.includes(',')){
            return parseInt(m)
        } else {
            return magnitude(m)
        }
}

function explode(str){
    let queue = str.split('');
    let seen = [];
    let counter = 0;
    let result;

    while(queue.length>0){
        let th = queue.shift();

        if(counter>=4 && th === '['){
            let pairTest = pairregex.exec(th.concat(queue.join('')));

            if(pairTest !== null && pairTest.index === 0){ // We want pair at start of the string
                result = th.concat(queue.join(''))
                break;
            }
        }
        seen.push(th)
    
        if(th === '['){
            counter++
        } else if (th === ']'){
            counter--
        }
    }

    if(seen.length===str.length){
        return str
    } else {
        let pairArr = JSON.parse(pairregex.exec(result)[0])
        let before = explodeNum(seen.join(''),pairArr,'left')
        let after = explodeNum(result,pairArr,'right')
        return `${before}${after}`  
    }

}

function addition(str){
    while(true){
        const prevStr = str
        if ((str = explode(str)) !== prevStr) continue;
        if ((str = split(str)) !== prevStr) continue;
        return prevStr;
    }
}

// Part 1
let p1lines = lines.slice()
let curr = p1lines.shift()

while(p1lines.length>0){
    let toAdd = p1lines.shift()
    let next = addition(`[${curr},${toAdd}]`)
    curr = next
}
console.log(magnitude(curr)) // Part 1 answer

// Part 2
let p2lines = lines.slice()
let highestMagnitude = 0

p2lines.forEach((snail1,ix)=>{
    let otherSnails = lines.filter((x)=> x !== snail1)

    otherSnails.forEach((snail2)=>{
        let addboth = [magnitude(addition(`[${snail1},${snail2}]`)),magnitude(addition(`[${snail2},${snail1}]`))]
        

        if(Math.max(...addboth) > highestMagnitude){
            highestMagnitude = Math.max(...addboth)
        }
    })
})

console.log(highestMagnitude) // Part 2 answer
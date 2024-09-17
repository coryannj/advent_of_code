const fs = require('fs');
const input = fs.readFileSync('../day25input.txt',{ encoding: 'utf8' });
const numRegex = /[-]{0,1}\d/g;

let lines = input.split(/[\r\n]+/).map((x)=>x.replaceAll('-','-1').replaceAll('=','-2').match(numRegex)).map((x)=>x.map(Number))

let maxLen = Math.max(...lines.map((x)=>x.length))
let factors = Array(maxLen+2).fill('.').map((x,ix)=>Math.pow(5,ix)).reverse()
let snafuTotal = 0

lines.forEach((x)=>{
    let result = factors.slice(-1*x.length).map((y,yx)=> y*x[yx]).reduce((acc,curr)=>acc+curr,0)
    snafuTotal+=result
})

let snafuFactors = factors.slice().reverse()
let snafu = {}
let lastFactor = snafuFactors.shift()
let snafuIndex = [0,1,2,-2,-1,0]

while(snafuFactors.length>0 && snafuTotal>0){
    
    let thisFactor = snafuFactors.shift()
    let mod = snafuTotal%thisFactor
    let newMod = (mod/lastFactor)+(snafu[lastFactor]??0)
    snafu[lastFactor] = snafuIndex[newMod]

    if(newMod>2){
        snafu[thisFactor] = (snafu[thisFactor]??0)+1
    }

    snafuTotal-=mod
    lastFactor = thisFactor
}

console.log(Object.values(snafu).reverse().map((x)=>{
    if(x === -2){
        return '='
    } else if(x === -1){
        return '-'
    } else {
        return x
    }
}).join('')) // Part 1 answer


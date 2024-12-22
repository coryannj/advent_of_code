const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day22.txt', {encoding: "utf8", flag: "r", });

const nums = input.lines().map(Number).map((x)=>BigInt(x))
const loops = 2000

const nextSecret = (num) => {
    let step1 = num*64n
    num = (step1^num)%16777216n
    let step2 = num/32n
    num = (step2^num)%16777216n
    let step3 = num*2048n
    return (step3^num)%16777216n
}

let p1 = []
let p2diffObj = {}

nums.forEach((n)=>{
    let p2Seen = new Set()
    let diffs = []
    for(i=0;i<loops;i++){
        let newn = nextSecret(n);
        diffs.push(newn%10n-n%10n);
        
        if(diffs.length === 4){
            if(!p2Seen.has(diffs.join(','))){
                p2Seen.add(diffs.join(','));
                if(p2diffObj[diffs.join(',')] === undefined){
                    p2diffObj[diffs.join(',')] = newn%10n;
                } else {
                    p2diffObj[diffs.join(',')]+=newn%10n;
                }
            }
        
            diffs.shift()
        }
        
        n = newn

    }
    p1.push(n);
})

console.log('Part 1 answer is ',p1.sum())

// Part 2
let p2Max = 0n

Object.values(p2diffObj).forEach((x)=>{
    if(x>p2Max){
        p2Max = x
    }
})

console.log('Part 2 answer is ',p2Max.toString())

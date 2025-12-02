const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day2.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(",").map((x)=>x.split('-').map(Number))
let linesLen = lines.length

const countInvalid = ([s,e], partNo) => {
    let
        sum = 0,
        [sLen,eLen] = [s.toString().length,e.toString().length],
        nextRange,
        skipTwice = false,
        skipChunks = false,
        skipNextChunks = false
    
    if(sLen%2===1 && sLen===eLen){ // All values in range odd length
        if(partNo===1) return 0;
        
        skipTwice = true;
        nextRange = [s,e];
        skipChunks=true;

        if(e<99999999){ // Max str length is 10, first odd number not prime is 9    
            skipNextChunks=true
        }
    } 
    
    if(!skipTwice){
        if(sLen !== eLen){ // Not generalised - know all the inputs have max diff of 1, max string length is 10 - normalise to where str.length is even
            if(eLen%2 === 1){
                let newMin = parseInt('9'.repeat(sLen));
                nextRange= [newMin+1,e];
                e = newMin;
                eLen = sLen;
            } else {
                let newMax = parseInt('9'.repeat(sLen))+1;
                if(newMax>10) nextRange=[s,newMax-1];
                s = newMax;
                sLen=eLen;
            }
        }

        if(e<99999) skipChunks=true

        // Split in half and iterate through range where matching
        let tFactor = [1,10,100,1000,10000,100000,1000000,10000000,100000000]
        let factor = tFactor[sLen/2]
        let [sSliceStart,sSliceEnd] = [Math.floor(s/factor),s%factor];
        let [esliceStart,esliceEnd] = [Math.floor(e/factor),e%factor];
        let sMin = sSliceStart<sSliceEnd ? sSliceStart+1 : sSliceStart;
        let eMax = esliceStart>esliceEnd ? esliceStart-1 : esliceStart;

        for(k=sMin;k<=eMax;k++){
            sum+=((k*factor)+k);
        }
    }

    if(partNo === 1) return sum

    // Part 2
    // Check all same where length not mod 2
    if(nextRange){
        let [ns,ne] = nextRange
        let nsLen = ns.toString().length
        let nsFirst = +ns.toString()[0].repeat(nsLen)<ns ? +ns.toString()[0]+1 : +ns.toString()[0]

        while(+nsFirst.toString().repeat(nsLen)<=ne){
            sum+= +nsFirst.toString().repeat(nsLen);
            nsFirst++;
            if(nsFirst>9) break;
        }

        if(ne<99999999) skipNextChunks=true
    }

    // Check chunks
    // Discard len <=5 and 8
    // length 6,10 - chunks of 2
    // length 9 - chunks of 3 

    const getChunks = ([rs,re],size) => {
        let
            sChunks = rs.toString().match(new RegExp('.{' + size + '}', 'g')).map(Number),eChunks = re.toString().match(new RegExp('.{' + size + '}', 'g')).map(Number),
            sVal = sChunks[0]<sChunks[1] ? sChunks[0]+1 : sChunks[0],
            eVal = eChunks[0]<=eChunks[1] ? eChunks[0] : eChunks[0]-1,
            cLen = sChunks.length,
            total = 0

        if(eVal<sVal) return 0

        for(c=sVal;c<=eVal;c++){
            if(size === 2 && c%11 === 0) continue;
            
            total+= +c.toString().repeat(cLen);
        }
        return total
    }

    if(!skipChunks && !skipTwice && sLen !== 8) sum+=getChunks([s,e],2);
    
    if(!skipNextChunks && nextRange !== undefined) sum+=getChunks([s,e],3);
    
    return sum
}

let t1 = performance.now()
let p1ans = 0

for(i=linesLen-1;i>=0;i--){
    p1ans+=countInvalid(lines[i],1)
}
let t2 = performance.now()
console.log('Part 1 answer is ',p1ans,((t2-t1)).toFixed(3),'ms')

let t3 = performance.now()
let p2ans = 0

for(i=linesLen-1;i>=0;i--){
    p2ans+=countInvalid(lines[i],2)
}
let t4 = performance.now()
console.log('Part 2 answer is ',p2ans,((t4-t3)).toFixed(3),'ms')

// First solution brute forcing the range

// function* makeRangeIterator(start, end, step = 1) {
//   let iterationCount = 0;
//   for (let i = start; i <= end; i += step) {
//     iterationCount++;
//     yield i;
//   }
//   return iterationCount;
// }

// function* invalidRange(start, end, partNo) {

//   for (let i = start; i <= end; i += step) {
//     iterationCount++;
//     yield i;
//   }
//   return iterationCount;
// }




// // <=10 always false

// // Part 1
// // len === 2 %11===0. <100
// // if end of range is length 1 more than start 9.repeat(start.len) is max

// // if start and end of range !== mod 2 return nothing



// const isInvalid = (n,partNo) =>{
    
//     let str = n.toString()
//     let len = str.length

//     if(len===1) return false

//     if((len%2===0 && str.slice(0,len/2)===str.slice(len/2))) return true;

//     if(partNo===1 || len === 2) return false;

//     if(str[0].repeat(len) === str) return true;

//     if(len<=5 || len===7) return false

//     console.log(str,len)

//     let factor = len === 9 ? 3 : 2

//     // let fObj = {
//     //     6:
//     // }

//     return str.match(new RegExp('.{' + factor + '}', 'g')).every((y,i,a)=>y===a[0])

// }

// let p1 = lines.flatMap(([s,e])=>makeRangeIterator(s,e,1).filter((n)=>isInvalid(n,1)).reduce((a,c)=>a+c,0)).reduce((a,c)=>a+c)

// console.log(p1)

// let p2 = lines.flatMap(([s,e])=>makeRangeIterator(s,e,1).filter((n)=>isInvalid(n,2)).reduce((a,c)=>a+c,0)).reduce((a,c)=>a+c)

// console.log(p2)
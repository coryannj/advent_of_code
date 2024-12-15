const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day11.txt', {encoding: "utf8", flag: "r", });
let arr = input.split(' ').map(Number).sorta()

    const cache = new Map();
    const numbers = input.split(' ').map(Number);
let t0 = performance.now()
    const blink = (number, blinks) => {
        // if(!cache.has(number)){
        //     cache.set(number,new Map())
        // }
        const cacheKey = (number*100)+blinks

        // if(cache.get(number).has(blinks)){
        //     return cache.get(number).get(blinks)
        // }

        //if (cache.has(cacheKey)) return cache.get(cacheKey);

        if(cache.has(cacheKey)){
            return cache.get(cacheKey)
        }



        let result;
        if (blinks === 0) result = 1;
        else if (number === 0) result = blink(1, blinks - 1);
        else if (('' + number).length % 2 === 0) {
            const str = '' + number;
            const firstHalf = +str.substring(0, str.length / 2);
            const secondHalf = +str.substring(str.length / 2);
            result = blink(firstHalf, blinks - 1) + blink(secondHalf, blinks - 1);
        } else {
            result = blink(number * 2024, blinks - 1);
        }

        cache.set(cacheKey,result);
        //cache.get(number).set(blinks,result);
        return result;
    }

    //console.log('D11P1', numbers.reduce((numberCount,number) => numberCount + blink(number, 25), 0));
    let p2total = numbers.reduce((numberCount,number) => numberCount + blink(number, 75), 0)
    let t1 = performance.now()
    
    console.log(p2total,t1-t0)

    //console.log([...cache.values()].flatMap((x)=>[...x.values()]).length)




// let arrLen = arr.length
// let p1loops = 25;
// let p2loops = 75;
// let p1Result = 0;
// let p2Result = 0;
// let valMap = new Map()
// let loopMap = new Map()
// let totalMap = new Map()

// for(i=0; i<arrLen; i++){
//     let loopVal = arr[i]

//      // [value, valCount]
//     let item = {
//         key: arr[i],
//         steps: 0,
//         stones:[[arr[i],1]],
//         runningTotal: 0
//     }

// }

// const doLoops = (numLoops,obj) => {
//     let queue = obj.stones

//     while(numLoops>0){

//     }
// }



















// let countKey = 0
// let iterations = 0
// let countObj = new Map()

// for(i=0; i<arr.length; i++){
//     let loopVal = arr[i]
//     let countMap = new Map();
//     countMap.set(loopVal,1);
    
//     if(!loopMap.has(loopVal)){
//         loopMap.set(loopVal,new Map())
//         loopMap.get(loopVal).set(0,countMap)
//     }

    
    
//     if(loopVal === 0){    
//         loopMap.set(1, new Map())
//         loopMap.set(2024, new Map())
//     }
    
//     let nextCountMap;

//     for(j=1;j<=p2loops;j++){
//         nextCountMap = new Map();
        
//         const setNext = (nKey,nVal) => nextCountMap.has(nKey) ? nextCountMap.set(nKey,(nextCountMap.get(nKey))+nVal) : nextCountMap.set(nKey,nVal)
        
//         for (const [key, value] of countMap) {

//             iterations++
//             if(!countObj.has(key)){
//                 countObj.set(key,Object.fromEntries(Array(75).fill('.').map((x,ix)=>[ix,0])))
                
//             } 
//             countObj.get(key)[j]++

//             if(arr.includes(key))countKey++
//             if(valMap.has(key)){
//                 let nextKey = valMap.get(key)

//                 if(typeof nextKey === 'number'){
//                     setNext(nextKey,value)
//                 } else {
//                     setNext(nextKey[0],value)
//                     setNext(nextKey[1],value)
//                 }
//                 continue;
//             } else {
//                 if(key === 0){
//                     valMap.set(key,1)
//                     setNext(1,value)
//                     continue;
//                 }

//                 if(key.toString().length%2 === 0){
//                     let split = key.toString()
//                     let newSplit = [split.slice(0,split.length/2),split.slice(split.length/2)].map(Number)

//                     valMap.set(key,newSplit)
//                     setNext(newSplit[0],value)
//                     setNext(newSplit[1],value)
//                     continue;
//                 }
                
//                 let nextKey = key*2024;
//                 valMap.set(key,nextKey)
//                 setNext(nextKey,value)

//             }
//         }
        
//         countMap = nextCountMap

//         if(j===p1loops){
//             p1Result+=[...countMap.values()].sum()
//         }
//         loopMap.get(loopVal).set(j,nextCountMap)
//         if(j>0 && loopVal === 0) loopMap.get(1).set(j-1,nextCountMap)
//         if(j>1 && loopVal === 0) loopMap.get(2024).set(j-2,nextCountMap)

//     }
//     console.log('i is ',i,' loopval was ',loopVal,' map keys length is ',[...valMap.keys()].length)
//     //console.log('countObj for ',loopVal)
    
//     p2Result+=[...countMap.values()].sum()
// }

// //console.log(countObj)


// console.log(p1Result,p2Result,countKey,iterations)

// console.log(loopMap)
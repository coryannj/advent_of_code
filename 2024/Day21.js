const fs = require("fs");
require("../utils.js");
const {MinQueue} = require("heapify");
const { join } = require("path");
const input = fs.readFileSync('../inputs/2024/day21.txt', {encoding: "utf8", flag: "r", });

//const codes = input.lines().mk2d()

const keypad = ['7','8','9','4','5','6','1','2','3','','0','A'].chunks(3)
//console.log(codes)


let dPad = ['','^','A','<','v','>'].chunks(3)
//console.log(dPad)


let keyStartR = keypad.findIndex((x)=>x.includes('A'))
let keyStartC = keypad[keyStartR].indexOf('A')

const keyPadVals = keypad.flatMap((x,ix)=>x.map((y,yx)=>[ix,yx,y]))
//console.log(keyPadVals)


// 341A
// 480A
// 286A
// 579A
// 149A

const codes = ['^A']



// 029A
// 980A
// 179A
// 456A
// 379A

//const codes = ['<A^A>^^AvvvA','^^^A<AvvvA>A','^<<A^^A>>AvvvA','^^<<A>A>AvvA','^A<<^^A>>AvvvA']

//const codes = ['<A^A>^^AvvvA']

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
    'vA':'>^A',
    '><':'<<A',
    '>v':'<A',
    '>^':'<^A',
    '>A':'^A',
    'A<':'v<<A',
    'A^':'<A',
    'Av':'<vA',
    'A>':'vA',
    '<<':'A',
    'vv':'A',
    '^^':'A',
    '>>':'A',
    'AA':'A'
}

let keyboards = 25
let targetDepth = keyboards-1

let p1 = []

const nextLevel = (str) => {
 //   console.log('str is ',str)
   if(str.length === 1){
    return dirs[str]
   } else {
    let result = ''

   for(i=0;i<str.length;i++){
  //  console.log('i is ',i,' result is ',result)    
    if(i===0){   
            result+=dirs[str[i]]
            //console.log('added ',str[i],' dirs[str[i]]',dirs[str[i]])
        } else {
            result+=dirs[str[i-1]+str[i]]
            //console.log('added ',str[i-1],str[i],' dirs[str[i-1]+str[i]]',dirs[str[i-1]+str[i]])
        }
   }
   return result
   }
   

}

// const pressKey = ([lastKey,nextKey],depth) => {
//     if(depth === targetDepth) return dirs[[lastKey,nextKey].join('')]
//     let resultStr = ''
//     let nextStr = dirs[[lastKey,nextKey].join('')]

//     return 
// }

// <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
// v<A<AA>>^AvAA<^A>Av<<A>>^AvA^A<vA>^Av<<A>^A>AAvA^Av<<A>A>^AAAvA<^A>A
// 980A: <v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A
// <v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
// v<<A>>^A<vA<A>>^AAvAA<^A>Av<<A>>^AAvA^A<vA>^AA<A>Av<<A>A>^AAAvA<^A>A
// <v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A
// v<<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>Av<<A>A>^AAvA<^A>A
// <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
// v<<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>Av<<A>A>^AAAvA<^A>A


// for (const code of codes) {
//     let output = code
//     //console.log('output is ',output)
//     for(j=0;j<targetDepth;j++){
//         newresult = nextLevel(output)
//         output = newresult

//         console.log('j is ',j,' newresult is ',newresult,'output is now ',output)
//     }
//     p1.push(output)
    
// }

let cache = {}




for (const code of codes) {
    let output = code.replaceAll('A','A ').split(' ').slice(0,-1)
    console.log('NEW LOOP ','code is',code,'output is ',output)
    



    let newOutput = []

    for(j=0;j<targetDepth;j++){
       // console.log('NEW LOOP j is ',j)
        for (const o of output){
            //console.log('o is ',o)
            if(cache[o] !== undefined){
               // console.log('cache hit found',cache[o])
                //newOutput.concat(...cache[o])
                cache[o].forEach((x)=>newOutput.push(x))
            } else {
                let newresult = nextLevel(o)

                let newItems = newresult.replaceAll('A','A ').split(' ').slice(0,-1)
                cache[o] = newItems
                //console.log('add to cache ','key is ',o,' value is ',cache[o])
                //newOutput = newOutput.concat(...newItems)
                newItems.forEach((x)=>newOutput.push(x))
            }

            //console.log('o is ',o,' newoutput is now ',newOutput)
        }
        
        
        //newresult = nextLevel(output)
        //output = newresult
        output = newOutput
        console.log('END LOOP j is ',j,' output length is now ',output.length, 'cache length is ',Object.keys(cache).length)
        newOutput = []
        
    }
    //console.log('end of loops output is ',output)
    //console.log('output join is ',output.join(''))

    p1.push(output.map((x)=>x.length).sum())
    
}



console.log(p1)


//let p1nums = [29,980,179,456,379]
 let p1nums = [341,480,286,579,149]
 console.log(p1.map((x,ix)=>x*p1nums[ix]).sum())





//  for (const code of codes) {
//     let output = code.replaceAll('A','A ').split(' ').slice(0,-1)
//    // console.log('NEW LOOP ','code is',code,'output is ',output)
    



//     let newOutput = []

//     for(j=0;j<targetDepth;j++){
//        // console.log('NEW LOOP j is ',j)
//         for (const o of output){
//             //console.log('o is ',o)
//             if(cache[o] !== undefined){
//                // console.log('cache hit found',cache[o])
//                 //newOutput.concat(...cache[o])
//                 cache[o].forEach((x)=>newOutput.push(x))
//             } else {
//                 let newresult = nextLevel(o)

//                 let newItems = newresult.replaceAll('A','A ').split(' ').slice(0,-1)
//                 cache[o] = newItems
//                 //console.log('add to cache ','key is ',o,' value is ',cache[o])
//                 //newOutput = newOutput.concat(...newItems)
//                 newItems.forEach((x)=>newOutput.push(x))
//             }

//             //console.log('o is ',o,' newoutput is now ',newOutput)
//         }
        
        
//         //newresult = nextLevel(output)
//         //output = newresult
//         output = newOutput
//         console.log('END LOOP j is ',j,' output length is now ',output.length)
//         newOutput = []
        
//     }
//     //console.log('end of loops output is ',output)
//     //console.log('output join is ',output.join(''))

//     p1.push(output.map((x)=>x.length).sum())
    
// }

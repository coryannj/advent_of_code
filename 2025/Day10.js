const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2025/day10.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/[\r\n]+/).map((x)=>x.match(/\S+/g))

// Part 1
let p1Min
let p1 = 0

const pressButtonsP1 = (startVal,buttons,target,count,lastbutton) => {
    if(count>10 || (p1Min !== undefined && count+1>=p1Min)) return null;

    if(buttons.some((x)=>(x^startVal) === target)) return count+1;

    let leastPresses = null

    for(const b of buttons.values()){
        if(b!==startVal){
            let nextVal = startVal^b
            let nextCount = pressButtonsP1(nextVal,buttons,target,count+1,b.join(''))
        
            if(nextCount !== null && (leastPresses === null || nextCount<leastPresses)){
                p1Min=nextCount
                leastPresses=nextCount
            }
        }
    }

    return leastPresses
}

lines.forEach((x,xi)=>{
    p1Min=undefined

    let d = x[0].replaceAll('.','0').replaceAll('#','1').match(/\d/g).map(Number).join('')

    let dBinary = parseInt(d,2)

    let buttons = x.slice(1,-1).map((y)=>y.match(/\d+/g).map(Number)).map((y)=>parseInt(Array(d.length).fill(0).map((z,zi) => y.includes(zi) ? 1 : 0).join(''),2))
    
    if(buttons.includes(dBinary)){
        p1+=1
    } else {
        p1+=pressButtonsP1(0,buttons,dBinary,0)
    }
})

console.log('Part 1 answer is ',p1)

let seen2
let badp2 = {}
let seenStatesp2 = {}


const repeatButton = (currVal,button) => {
    if(currVal.every((x,xi)=>x===0)|| button.some((x,xi)=>x+currVal[xi]===0)) return true
    let currSame = currVal.filter((x)=>x>0).every((x,xi,a)=>x===a[0])
    //console.log(diff,diffSame)
    return currSame && button.every((x,xi)=> (x === currVal[xi]) || (x===-1 && currVal[xi]>0)) 
}

//console.log(repeatButton([3,3,4,7],[0,1,1,0],[3,4,5,7]))


const pressButtonsP2 = (startVal,buttons,count,lastState) =>{
    
    if((seen2 !== undefined && count+Math.max(...startVal)>=seen2)||(seenStatesp2[startVal.join('')] !== undefined && seenStatesp2[startVal.join('')]<count)||badp2[startVal.join('')]) return null
    if(startVal.some((x)=>x<0)||(buttons.every((x,xi)=> x.some((y,yi)=>y+startVal[yi]<0)))){
        badp2[lastState] = true
        badp2[startVal.join('')] = true
        //console.log(badp2)
        return null
    }
    //console.log('new loop',startVal,buttons,count,seen2)
    if(startVal.filter((x)=>x>0).every((x,i,a)=>x===a[0])) console.log('all same ',startVal,buttons)
    if(buttons.some((x)=>repeatButton(startVal,x)) ){
        //console.log('end val found, count is ', count,' adding ',(startVal.find((x)=>x>0)??0))
        return count+(startVal.find((x)=>x>0)??0)
    }

    if(count>0)seenStatesp2[startVal.join('')] = count
    //if(count>500||buttons.length === 0) return null;
    
    //if((seen2[target.join('')] !== undefined && count+1>=seen2[target.join('')])) return null;
    //if(buttons.every((x,xi)=> x.some((y,yi)=>y+startVal[yi]>target[yi]))) return null


    let leastPresses = null

    //let nextVals = buttons.map((x)=> x ^ startVal)
    //presses++   
    for(const b of buttons.values()){
        
        //if(b !== startVal && (lastbutton === undefined || lastbutton !== b)){
            let thisButton = b
            let nextVal = startVal.map((x,xi)=>x+thisButton[xi])
            let nCount = count+1
            
            //console.log('button is ',thisButton,' seen[target]',seen2[target.join('')],' next val',nextVal,buttons,target,nCount)
            // if(seenStatesp2[nextVal.join('')] === undefined || seenStatesp2[nextVal.join('')]>=nCount){
                
            let nextCount = pressButtonsP2(nextVal,buttons,nCount,startVal.join(''))
            //}

            //nextCount = pressButtonsP2(nextVal,buttons,nCount,startVal.join(''))
        
            if(nextCount !== null && (leastPresses === null || nextCount<leastPresses)){
                seen2=nextCount
                leastPresses=nextCount
            }
        //}
    }

    //if(leastPresses===null) console.log('error ')

    return leastPresses
}

// console.log(pressButtonsP2([ 3, 5, 4, 7 ],[
//   [ 0, 0, 0, -1 ],
//   [ 0, -1, 0, -1 ],
//   [ 0, 0, -1, 0 ],
//   [ 0, 0, -1, -1 ],
//   [ -1, 0, -1, 0 ],
//   [ -1, -1, 0, 0 ]
// ],0))
//console.log(seenStatesp2)

//console.log(0^5)
//console.log(pressButtons(0,[ 5, 3, 1, 2,  10, 12 ],6,0))
//console.log(seen)


let p2 = []


console.log(p2)
console.log(p2.reduce((a,c)=>a+c))

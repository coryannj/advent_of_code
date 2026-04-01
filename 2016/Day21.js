const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day21.txt', {encoding: "utf8", flag: "r", });

const insRegex = /(?<=^|\s)(reverse|based|rotate|swap|move|left|right|\d+|\w)(?=\s|$)/gm

const solve = (str,input,partNo=1) => {
    let lines = input.split(/\n/).map((x)=>x.match(insRegex).map((y)=>isNaN(+y)? y : +y))
    let arr = str.split('')
    let len = arr.length
    let maxInd = len-1

    const ops = {
        swap: (x1,x2) => isNaN(+x1) ? arr = arr.with(arr.indexOf(x1),x2).with(arr.indexOf(x2),x1) : arr = arr.with(x1,arr[x2]).with(x2,arr[x1]),
        move: (ind1,ind2) => arr.splice(ind2,0,arr.splice(ind1,1)[0]),
        rotate: (dir,s) => {
            let steps = s

            if(dir === 'based'){
                let ind = arr.indexOf(s)
                steps = ind>=4 ? ind+2 : ind+1
                dir = 'right'
            }
            
            while(steps--){
                if(dir === 'right') arr.unshift(arr.pop())
                if(dir === 'left') arr.push(arr.shift())
            }
        },
        reverse: (ind1,ind2) => {
            if(ind1 === 0 && ind2 === maxInd){
                arr.reverse()
            } else {
                let reverseVals = Array(ind2-ind1+1).fill().map((x,i)=>arr[i+ind1]).reverse()

                for(i=ind1;i<=ind2;i++){
                    arr[i] = reverseVals[i-ind1]
                }
            }
        }
    }

    if(partNo === 1){
        lines.forEach(([ins,...details])=> ops[ins](...details))
    } else {
        lines.reverse().forEach(([ins,...details])=>{
            if(ins !== 'rotate'){
                ins === 'reverse' ? ops[ins](...details) : ops[ins](details[1],details[0])
            } else {
                if(details[0] !== 'based'){
                    details[0] === 'right' ? ops[ins]('left',details[1]) : ops[ins]('right',details[1])
                } else {
                    let currIndex = arr.indexOf(details[1])
                    let shiftVal = [1,1,6,2,7,3,0,4]
                    ops[ins]('left',shiftVal[currIndex])
                }
            } 
        })
    }

    return arr.join('')
}
console.log(solve('abcdefgh',input,1))
console.log(solve('fbgdceah',input,2))

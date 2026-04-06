const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2017/day10.txt', {encoding: "utf8", flag: "r", });

const solve = (input,partNo) => {
    let 
        lengths = partNo === 1 ? input.split(',').map(Number) : input.split('').map((x)=>x.charCodeAt(0)).concat([17, 31, 73, 47, 23]),
        listLen = 256,
        list = Array(listLen).fill().map((x,i)=>i),
        rounds = partNo === 1 ? 1 : 64,
        currPos = 0,
        skipSize = 0
    
    while(rounds--){
        for(const l of lengths){
            let subList = list.splice(currPos,l)

            if(subList.length<l){
                let endLen = subList.length
                let startLen = l-endLen
                subList = subList.concat(list.splice(0,startLen)).reverse()
                list.splice(currPos,0,...subList.splice(0,endLen))
                list.splice(0,0,...subList)
            } else {
                list.splice(currPos,0,...subList.reverse())
            }

            currPos = (currPos + l + skipSize) % listLen
            skipSize++
        }
    }

return partNo === 1 ? list[0]*list[1] : list.chunks(16).map((x)=>(x.reduce((a,c)=>a^c)).toString(16).padStart(2,'0')).join('')

}

console.log(solve(input,1))
console.log(solve(input,2))

module.exports = {
  solve
};
const { sign } = require('crypto');
const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day17.txt', {encoding: "utf8", flag: "r", });

let containers = input.split(/\n/g).map(Number).sort((a,b)=>a-b)
const limit = 150
const multiples = containers.filter((x,i,a)=>a.findIndex((y,yi)=> y === x) !== i)
const mRegex = multiples.map((x)=>new RegExp(`${x}`,'g'))
const multiplier = (str) => mRegex.map((x)=>x.test(str) ? 3-str.match(x).length : 1).reduce((a,c)=>a*c,1)

containers = [...new Set(containers)]

let
    queue = containers.map((x)=>[x,[x]]),
    combos = new Set(),
    seen = new Set()

while(queue.length){
    let [sum,sizes] = queue.shift()
    
    for(const c of containers){
        if(c+sum>limit) break;

        if(sizes.includes(c) && (!multiples.includes(c) || (multiples.includes(c) && sizes.filter((x)=>x===c).length > 1)))  continue;

        let newNext = [nSum,nSizes] = [sum+c,sizes.concat(c).sort((a,b)=>a-b)]
        let nKey = nSizes.join('_')
        
        if(c+sum === limit){
            combos.add(nKey)
        } else {
            if(!seen.has(nKey)){
                seen.add(nKey)
                queue.push(newNext)
            }
        }
    }
}

let allCombos = combos.values().toArray()
let minComboLen = allCombos[0].split('_').length

console.log(allCombos.reduce((a,c)=>a+(multiplier(c)),0)) // Part 1
console.log(allCombos.filter((x)=>x.split('_').length === minComboLen).reduce((a,c)=>a+(multiplier(c)),0)) // Part 2
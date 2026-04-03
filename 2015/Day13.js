const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day13.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/\n/g).map((x)=>x.slice(0,-1).match(/(^\S+|\S+$)|(lose \d+)|(gain \d+)/gm)).map((x)=>[x[0],x[2],parseInt(x[1].replace(/gain |lose /m,m=>m === 'gain ' ? '+' : '-'))])

let
    names = [...new Set(lines.flatMap((x)=>[x[0],x[1]]))],
    nLen = names.length,
    happiness = Object.fromEntries(names.map((x)=>[x,Object.fromEntries(lines.filter((y)=>y[0] === x).map((y)=>y.slice(1)))])),
    p1Max = 0

const totalChange = (v,ind,arr) => {
    if(v === 'me') return 0
    let prev = ind === 0 ? arr.at(-1) : arr[ind-1]
    let next = ind === arr.length-1 ? arr[0] : arr[ind+1]
    return (happiness[v]?.[prev] ?? 0) + (happiness[v]?.[next] ?? 0)
}

function* cartesian(head, ...tail) {
  const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
  for (let r of remainder){
    for (let h of head){
        let result = [h, ...r]
        if(!r.includes(h)){
            if(result.length<nLen){
                yield [h, ...r];
            } else{
                let sum = result.map((x,i,a)=>totalChange(x,i,a)).reduce((a,c)=>a+c,0)

                if(sum>p1Max){
                    p1Max = sum
                    yield [sum,result]
                } 
            }
        }
 
    } 
  } 
}

let [p1Optimal,p1OptimalSeating] = cartesian(...Array(nLen).fill().map((x)=>names.slice())).toArray().at(-1)

console.log(p1Optimal) // Part 1 answer

let p2Optimal = 0

for(i=0;i<nLen;i++){
    let addMe = p1OptimalSeating.toSpliced(i,0,'me').map((x,xi,a)=>totalChange(x,xi,a)).reduce((a,c)=>a+c)

    if(addMe>p2Optimal) p2Optimal = addMe
}
console.log(p2Optimal) // Part 2 answer
const fs = require('fs');
const input = fs.readFileSync('../day14input.txt',{ encoding: 'utf8', flag: 'r' });

let instructions = input.split(/\n\n/)
let template = instructions[0].split((''))
let rules = Object.fromEntries(instructions[1].split(/[\r\n]+/).map((x)=>x.split(' -> ')))

let countObj = Object.fromEntries([...Object.keys(rules)].map((x)=>[x,0]))
let initialCount = template.map((x,ix,arr)=> ix<arr.length-1?`${x}${arr[ix+1]}`:x);
initialCount.pop();
initialCount.forEach((pair)=>countObj[pair]++);

let steps = 40

while(steps>0){
    let newCountObj = {...countObj}
    Object.entries(countObj).forEach(([pair,count])=>{
            let insert = rules[pair]
            newCountObj[`${pair[0]}${insert}`]+=count
            newCountObj[`${insert}${pair[1]}`]+=count
            newCountObj[pair]-=count
    })
    countObj = newCountObj
    steps--

    if(steps===30){
        let p1resultObj = Object.entries(countObj).map(([pair,count],ix,arr)=>[pair.charAt(0),count]).reduce((acc,curr)=>{
            return acc[curr[0]] ? acc[curr[0]]+=curr[1] : acc[curr[0]] = curr[1], acc
        },{})
        p1resultObj[template.at(-1)]++
        console.log('Part 1 result is ',[...Object.values(p1resultObj)].sort((a,b)=>a-b).filter((x,ix,arr)=> ix === 0 || ix === arr.length-1).reduce((acc,curr)=>curr-acc,0))
    }
}

let p2resultObj = Object.entries(countObj).map(([pair,count],ix,arr)=>[pair.charAt(0),count]).reduce((acc,curr)=>{
    return acc[curr[0]] ? acc[curr[0]]+=curr[1] : acc[curr[0]] = curr[1], acc
},{})
p2resultObj[template.at(-1)]++
console.log('Part 2 result is ',[...Object.values(p2resultObj)].sort((a,b)=>a-b).filter((x,ix,arr)=> ix === 0 || ix === arr.length-1).reduce((acc,curr)=>curr-acc,0))

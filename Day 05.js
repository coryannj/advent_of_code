const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day5input.txt',{ encoding: 'utf8', flag: 'r' });

const numRegex = /(\d+)/g
const letterRegex = /([0-9A-Z])|(?<=\s)(\s{4})|(?<=\s)(\s{3})(?=$)/gm

const groups = input.split(/\n\s*\n/);

let boxesSplit = groups[0].split(/[\r\n]+/).map((x)=> x.match(letterRegex));

let boxes = boxesSplit.slice(0,-1);
let boxKeys = boxesSplit.at(-1).map(Number);


let p1boxMap = new Map();
let p2boxMap = new Map();


boxKeys.forEach((key,ix)=>{
    let boxCol = boxes.map((x)=> x[ix]).reverse().filter((y)=> y.length===1);
    p1boxMap.set(key,boxCol.slice(0));
    p2boxMap.set(key,boxCol.slice(0));
})

let procedures = groups[1].split(/[\r\n]+/).map((x)=> x.match(numRegex).map(Number))

procedures.forEach(([count,start,end])=>{
    for(i=0;i<count;i++){
        let boxToMove = p1boxMap.get(start).pop();
        p1boxMap.get(end).push(boxToMove);
    }

    let p2curr = p2boxMap.get(start);
    let p2BoxesToMove = p2curr.slice(-count);
    let p2Remaining = p2curr.slice(0,p2curr.length-count);
    let p2Next = p2boxMap.get(end);

    p2boxMap.set(start,p2Remaining);
    p2boxMap.set(end,p2Next.concat(p2BoxesToMove));

})

console.log([...p1boxMap.values()].map((x)=> x.at(-1)).join('')) // Part 1 answer
console.log([...p2boxMap.values()].map((x)=> x.at(-1)).join('')) // Part 2 answer
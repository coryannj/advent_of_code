const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2019/day22.txt', {encoding: "utf8", flag: "r", })

let lines = input.split(/\n/g).map((x)=>x.match(/(cut|increment|stack|[+-]?\d+)/g).map((x)=>isNaN(x)?x:BigInt(+x)))

const findNewIndex = (processList,deckLen,pos) => {
    deckLen = BigInt(deckLen)
    pos = BigInt(pos)

    const ops = {
        stack:(pos) => (deckLen-pos-1n),
        cut:(pos,v) => (pos-v+deckLen)%deckLen,
        increment:(pos,v) => (pos * v)%deckLen
    }

    return processList.reduce((a,ins)=> ops[ins[0]](a,ins.at(-1)),BigInt(pos))%deckLen    
}

console.log(findNewIndex(lines,10007,2019)) // Part 1 answer

// Part 2
// Get Ax+b where A(orig pos) + b = new position

let b = findNewIndex(lines,119315717514047,0)
let A = findNewIndex(lines,119315717514047,1)-b

// Got stuck here, used https://www.reddit.com/r/adventofcode/comments/ee0rqi/comment/fbqshh2/ to get the answer but couldn't rewrite it 

//Also tried to implement version of https://github.com/surgi1/adventofcode/blob/main/2019/day22/script.js but it doesn't get right answer on my input :-( 
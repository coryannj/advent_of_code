const fs = require('fs');
const input = fs.readFileSync('../day2input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.replaceAll('Game ','').split(/[\r\n]+/).map((x)=>x.split(/[:,;]/)).map((x)=>x.map((y,yx)=>yx === 0 ? y : y.trim().split(' ').map((z,zx)=>zx===0?parseInt(z):z)))

const gameIndexes = lines.map((x)=>parseInt(x[0]))
const cubes1 = {red:12, green:13, blue:14}

//Part 1
const games = lines.map((x)=>x.slice(1).reduce(function (acc, curr) {
    if(acc[curr[1]]===undefined){
        return acc[curr[1]]=curr[0],acc
    } else {
        return acc[curr[1]] = Math.max(acc[curr[1]],curr[0]),acc
    }
  }, {}))

console.log(games.map((x,ix)=>Object.entries(x).every(([k,v])=>v<=cubes1[k])?gameIndexes[ix]:0).reduce((acc,curr)=>acc+curr))

// Part 2
console.log(games.map((x)=>Object.values(x).reduce((acc,curr)=>acc*curr,1)).reduce((acc,curr)=>acc+curr))
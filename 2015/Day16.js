const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day16.txt', {encoding: "utf8", flag: "r", });

let aunts = Object.fromEntries(input.split(/\n/g).map((x)=>x.split(/[:\s,]+/)).map((x)=>[x[1],Object.fromEntries(x.slice(2).chunks(2).map(([k,v])=>[k,+v]))]))

let message = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
}

const solve = (partNo) => {
    const f = ([k,v],partNo) => {
        if(partNo === 1) return message[k] === v

        let lessKeys = ['trees','cats']
        let moreKeys = ['pomeranians','goldfish']

        if(lessKeys.includes(k)){
            return message[k] < v
        } else if (moreKeys.includes(k)){
            return message[k] > v
        } else {
            return message[k] === v
        }
    }

    return Object.entries(aunts).map(([id,obj])=>[id,Object.entries(obj).filter((x)=>f(x,partNo)).length]).sort((a,b)=>b[1]-a[1])[0][0]
}

console.log(solve(1))
console.log(solve(2))
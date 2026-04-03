const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day11.txt', {encoding: "utf8", flag: "r", });

let a = 'abcdefghjkmnpqrstuvwxyz'

let straights = new RegExp(a.slice(0,-2).split('').map((x)=>[x,String.fromCharCode(x.charCodeAt(0)+1),String.fromCharCode(x.charCodeAt(0)+2)].join('')).filter((x)=>a.includes(x)).join('|'),"g")

let repeats = /(.)\1/g

let notAllowed = /[iol]/g

const increment = (str) => {
    if(str.length === 1) return a[a.indexOf(str)+1]
    if(str.slice(-1) !== 'z') return str.slice(0,-1)+a[a.indexOf(str.slice(-1))+1]

    return increment(str.slice(0,-1))+'a'
}

const solve = (str) => {
    str = str.replace(notAllowed, m => m === 'i' ? 'j' : m === 'l' ? 'k' : 'p')

    while(!straights.test(str) || !repeats.test(str) || new Set(str.match(repeats).map((x)=>x[0])).size<2){
        str = increment(str)
    }

    return str
}

let p1 = solve(input)

console.log(p1)
console.log(solve(increment(p1)))
const fs = require('fs');
const { md5 } = require('../utils.js');

let salt = 'ngcjuoqr'

const threeRegex = /(.)\1{2}/

const getmd5 = (str,partNo) => {
    if(partNo === 1) return md5(str)

    let rounds = 2017

    while(rounds-- > 0){
        str = md5(str)
    }

    return str
}

const solve = (partNo) => {
    let counter = 1000

    let arr = Array(counter).fill().map((x,i)=>[i,getmd5(`${salt}${i}`,partNo)])

    let valid = []

    while(valid.length<64){
        let next = [thisInd,thisHash] = arr.shift()
        arr.push([counter,getmd5(`${salt}${counter}`,partNo)])
        counter++

        let hasThree = thisHash.match(threeRegex)

        if(hasThree === null) continue;

        if(arr.some(([i,h])=>h.includes(hasThree[1].repeat(5)))) valid.push(next)
    }

    return valid.at(-1)[0]
}

console.log(solve(1))
console.log(solve(2))

const fs = require('fs');
const { highestFactor } = require('../inputs/utils.js');
require('../inputs/utils.js');
//const input = fs.readFileSync('../inputs/2015/day20.txt', {encoding: "utf8", flag: "r", });

const input = 34000000
//const input = 10000
const uLimit = input/10
//const uLimit = 1000
let houses = Array(uLimit).fill(0).map((x)=>x)

const factors = (n) => {
    let result = []
    //let limit = Math.floor(Math.sqrt(n))
    for(i=1;i<=n/2;i++){
        if(n%i === 0) result.push(i)
    }
    return result.concat(n)
}


//console.log(factors(1600000).map((x)=>x*10).reduce((a,c)=>a+c))


for(j=700000;j<uLimit;j++){
    let f = factors(j).filter((x)=>(x+(49*x))>=j) // rollback for p1
    let r = f.reduce((a,c)=>a+(c*11),0)// rollback for p1
    //console.log(j,r,f)
    if(r>=input){
        console.log(j,r,f)
        break
    }

    if(j%10000 === 0){
        console.log(j,r,f.length,f)
    } 
}




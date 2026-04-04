const fs = require('fs');
require('../inputs/utils.js');

let memo = {}

const solve = (partNo) => {
    const input = 34000000

    const factors = (n, partNo) => {
        let result = memo[n]
        
        if(!result){
            result = []

            for(i=1;i<=n/2;i++){
                if(n%i === 0) result.push(i)
            }

            result.push(n)
            memo[n] = result
        }

        return partNo === 1 ? result : result.filter((x)=>(x*50)>=n)
    }

    function* presents(partNo){
        let counter = 750000

        while(counter++){
            yield [counter,factors(counter,partNo).reduce((a,c)=>a+(c*(partNo === 1 ? 10 : 11)),0)]
        }
    }

    return presents(partNo).find(([ind,sum])=>sum>=input)[0]
}

console.log(solve(1)) // Part 1
console.log(solve(2)) // Part 2
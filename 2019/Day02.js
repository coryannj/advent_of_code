const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2019/day02.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(',').map(Number)

const solve = (arr,noun,verb) => {
    let currInd = 0
    arr=arr.with(1,noun).with(2,verb)

    const ops = {
        1:(a,b,c) => arr = arr.with(c,arr[a]+arr[b]),
        2:(a,b,c) => arr = arr.with(c,arr[a]*arr[b])
    }

    while(arr[currInd] !== 99){
        let [op,a,b,c] = arr.slice(currInd,currInd+4)
        ops[op](a,b,c)
        currInd+=4
    }
    
    return arr[0]
}

console.log(solve(lines,12,2))

for(i=0;i<100;i++){
    for(j=0;j<100;j++){
        if(solve(lines,i,j) === 19690720){
            console.log((100*i)+j)
            break;
        }
    }
}
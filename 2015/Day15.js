const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day15.txt', {encoding: "utf8", flag: "r", });

let ingredients = Object.fromEntries(input.split(/\n/g).map((x,i)=>[i,x.match(/([-]?\d+)/g).map(Number)]))

let iLen = Object.keys(ingredients).length

const solve = (partNo) => {
    let tsp = 100
    let max = 0

    const score = (arr,partNo) => {
        let iScores = arr.map((x,i)=>ingredients[i].map((y)=>y*x))
        let allScores = iScores[0].map((x,i)=>Math.max(0,iScores.map((y)=>y[i]).reduce((a,c)=>a+c,0)))
        let calories = allScores.at(-1)
        
        return partNo === 1 || (partNo === 2 && calories === 500) ? allScores.slice(0,-1).reduce((a,c)=>a*c,1) : -1
    }

    function* cartesian(head, ...tail) {
        const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
        for (let r of remainder){
            for (let h of head){
                if(r.length === 0){
                    yield [h, ...r];
                } else {
                    let result = [h, ...r]
                    let sum = result.reduce((a,c)=>a+c)
                    if(sum<=tsp){
                        if(result.length<iLen){
                            yield [h, ...r]
                        } else {
                            let currScore = score(result,partNo)
                            if(currScore>0 && currScore>max){
                                max = currScore
                                yield [h, ...r]
                            }
                        }
                    }
                }
                    
            } 
        } 
    }

    let thisScores = cartesian(...Array(iLen).fill().map((x)=>Array(tsp+1).fill().map((y,yi)=>yi)))

    let currVal

    do{
        currVal = thisScores.next()
    } while(!currVal.done)

    return max
}

console.log(solve(1))
console.log(solve(2))
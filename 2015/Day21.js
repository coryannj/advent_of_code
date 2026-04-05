const { sign } = require('crypto');
const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day21.txt', {encoding: "utf8", flag: "r", });

const items = [
                [[8,4],[10,5],[25,6],[40,7],[74,8]],
                [[0,0],[13,-1],[31,-2],[53,-3],[75,-4],[102,-5]],
                [[0,0],[25,1],[50,2],[100,3],[20,-1],[40,-2],[80,-3]],
                [[0,0],[25,1],[50,2],[100,3],[20,-1],[40,-2],[80,-3]]
            ]
const allUpgrades = items.map((x)=>x.map((y)=>y[1]))
const iLen = items.length
const enemy = input.match(/\d+/g).map(Number).map((x,i)=>i !== 2 ? x : -x)

const doIWin = ([mHP,md,ma],[eHP,ed,ea]) => {
    mDamage = Math.max(1,(md+ea))
    eDamage = Math.max(1,(ed+ma))

    mTurns = Math.ceil(eHP/mDamage)
    eTurns = Math.ceil(mHP/eDamage)

    return mTurns <= eTurns
}

let 
    minCost = Infinity,
    maxCost = 0

function* cartesian(head, ...tail) {
  const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
  for (let r of remainder){
    for (let h of head) {
        let result = [h, ...r];
        if(result.length < iLen){
            yield result 
        } else {
            if(result[2] !== result[3] || result[2] === 0){
                let thisMe = result.reduce((a,c)=> c>0 ? a.with(1,a[1]+c) : a.with(2,a[2]+c),[100,0,0])

                let cost = result.map((x,i)=>items[i].find((y)=>y[1] === x)[0]).reduce((a,c)=>a+c)

                if(doIWin(thisMe,enemy)){
                    if(cost<minCost){
                        minCost=cost
                    }  
                } else {
                    if(cost>maxCost){
                        maxCost=cost
                    }
                }
            } 
        }
    }
  } 
}

cartesian(...allUpgrades).toArray()
console.log(minCost,maxCost)
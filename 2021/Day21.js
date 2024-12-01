const fs = require('fs');
const input = fs.readFileSync('../day21input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=>parseInt(x.slice(-2).trim()))

let pos = 0
let p1pos = lines[0]
let p2pos = lines[1]
let turn = 0
let p1score = 0
let p2score = 0

while (p1score < 1000 && p2score < 1000){
    let score = [(pos%100)+1,((pos+1)%100)+1,((pos+2)%100)+1]
    let scoreIndex = score.reduce((acc,curr)=>acc+curr,0)
    if(turn%2 === 0){ // p1
        let newscore = (p1pos+scoreIndex-1)%10+1
        p1score+=newscore
        //console.log('Player 1 rolls ',score,' and moves to space ',newscore,'  for a total score of ',p1score)
        p1pos = newscore
    } else { // p2
        let newscore = (p2pos+scoreIndex-1)%10+1
        p2score+=newscore
        //console.log('Player 1 rolls ',score,' and moves to space ',newscore,'  for a total score of ',p2score)
        p2pos = newscore
    }
    pos+=3
    turn++
}

console.log(Math.min(p1score,p2score)*turn*3) // Part 1 answer

// Part 2

// Calculate frequencies for dice rolls per turn
function* permutate(items, count) {
    yield* req([])
  
    function* req(array) {
      if (array.length == count) {
        yield array.map(Number)
        return
      }
      for (const item of items) {
        yield* req(array.concat(item))
      }
    }
  }
  
let universes = [...permutate(['1', '2', '3'], 3)].map((x)=>x.reduce((acc,curr)=>acc+curr,0)).sort((a,b)=>a-b).reduce((m, k) => { m[k] = m[k] + 1 || 1; return m }, {})
let universeMap = new Map(Object.entries(universes).map(([x,y])=>[parseInt(x),y]))

function getUniverses(startArr){
    let queue  = [[startArr]]
    let result = []
    let under = []
    while (queue.length>0){
        let thisVal = queue.shift()
        let [lastScore,lastDice,lastPos] = thisVal.at(-1)
        
        for(i=3;i<=9;i++){
            let nextVal = ((lastPos+i-1)%10)+1
            if(lastScore+nextVal>=21){
                result.push(thisVal.concat([[lastScore+nextVal,i,nextVal]]))
            } else {
                queue.push(thisVal.concat([[lastScore+nextVal,i,nextVal]]))
                under.push(thisVal.concat([[lastScore+nextVal,i,nextVal]]))
            }
            
        }
    }
    return {'result':result,'under':under}
}

let p1 = getUniverses([0,0,p1pos])
let p1over = p1['result']
let p1under = p1['under']
let p1OverTurns = [...new Set(p1over.map((x)=>x.slice(1).length))]
let p1OverUniverses = p1over.map((x)=> x.map((y)=>y[1]).slice(1).map((z)=>universeMap.get(z)))
let p1UnderUniverses = p1under.map((x)=> x.map((y)=>y[1]).slice(1).map((z)=>universeMap.get(z)))

let p2 = getUniverses([0,0,p2pos])
let p2over = p2['result']
let p2under = p2['under']
let p2OverTurns = [...new Set(p2over.map((x)=>x.slice(1).length))]
let p2OverUniverses = p2over.map((x)=> x.map((y)=>y[1]).slice(1).map((z)=>universeMap.get(z)))
let p2UnderUniverses = p2under.map((x)=> x.map((y)=>y[1]).slice(1).map((z)=>universeMap.get(z)))

let p1Wins = 0
let p2Wins = 0

p1OverTurns.forEach((len)=>{
    let p1Win = p1OverUniverses.filter((x)=>x.length === len).flatMap((y)=>y.reduce((a,b)=>a*b,1))
    let p2Lose = p2UnderUniverses.filter((x)=>x.length === len-1).flatMap((y)=>y.reduce((a,b)=>a*b,1))

    p1Win.forEach((p1Total)=>{
        p2Lose.forEach((p2Total)=>{
            p1Wins+=(p1Total*p2Total)
        })
    })
})

p2OverTurns.forEach((len)=>{
    let p2Win = p2OverUniverses.filter((x)=>x.length === len).flatMap((y)=>y.reduce((a,b)=>a*b,1))
    let p1Lose = p1UnderUniverses.filter((x)=>x.length === len).flatMap((y)=>y.reduce((a,b)=>a*b,1))

    p2Win.forEach((p2Total)=>{
        p1Lose.forEach((p1Total)=>{
            p2Wins+=(p2Total*p1Total)
        })
    })
})

console.log(Math.max(p1Wins,p2Wins)) // Part 2 answer

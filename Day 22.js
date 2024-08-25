const fs = require('fs');
const input = fs.readFileSync('../day22input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\n/).map((x)=>x.split(/[\r\n]+/)).map((x)=>x.slice(1).map(Number))

let players = structuredClone(lines)
//console.log(players.map((x)=>x.join('-')).join('-'))


while(players.every((x)=>x.length > 0)){
    p1 = players[0].shift()
    p2 = players[1].shift()

    if(p1>p2){
        players[0].push(p1)
        players[0].push(p2)
    } else {
        players[1].push(p2)
        players[1].push(p1)
    }
//console.log(players)
}

let states = {}
let subgames = 0

console.log(players.flat().slice().reverse().map((x,ix)=> x*(ix+1)).reduce((acc,curr)=>acc+curr,0)) // Part 1 answer

function playGame(gameState,gamename){
    let [p1,p2] = structuredClone(gameState)
    
    while([p1,p2].every((x)=>x.length>0)){
        console.log('p1,p2 is ',p1,p2)
        if(states[gamename] !== undefined && states[gamename].includes([p1,p2].map((x)=>x.join('-')).join('-'))) {
            console.log('prev state')
            p1.push(p1.shift())
            p1.push(p2.shift())
            //return[p1,p2]
        } else {
            
            
            if(p1[0]<=p1.slice(1).length && p2[0]<=p2.slice(1).length){
                console.log('')
                let subGame = playGame([p1.slice(1,1+p1[0]),p2.slice(1+p2[0])])
                console.log('subgame is ',subGame)
                if(subGame[0].length>0){
                    p1.push(p1.shift())
                    p1.push(p2.shift())
                } else {
                    p2.push(p2.shift())
                    p2.push(p1.shift())
                }
            } else {
                states.push([p1,p2].map((x)=>x.join('-')).join('-'))
                if(p1[0]>p2[0]){
                    p1.push(p1.shift())
                    p1.push(p2.shift())
                } else {
                    p2.push(p1.shift())
                    p2.push(p2.shift())
                }
                // let p1Card = p1.shift()
                // let p2Card = p2.shift()
                
            }
        }
    }
    return [p1,p2]
}

let p2Players = structuredClone(lines)

console.log(playGame(p2Players))
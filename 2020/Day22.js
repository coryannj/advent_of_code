const fs = require('fs');

const input = fs.readFileSync('../day22input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\n/).map((x)=>x.split(/[\r\n]+/)).map((x)=>x.slice(1).map(Number))

// Part 1
let players = structuredClone(lines)

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

}

console.log(players.flat().slice().reverse().map((x,ix)=> x*(ix+1)).reduce((acc,curr)=>acc+curr,0)) // Part 1 answer

//Part 2
function playGame(gameState){
    
    let [p1,p2] = gameState;
    let states = new Set();
    
    while([p1,p2].every((x)=>x.length>0)){
        let state = [p1,p2].map((x)=>x.join(',')).join('#')

        if(states.has(state)) {
            return[p1,[]]
        }
        states.add(state)

        let p1card = p1.shift();
        let p2card = p2.shift();

        if(p1card<=p1.length && p2card<=p2.length){
            let subGame = playGame([p1.slice(0,p1card),p2.slice(0,p2card)]);

            if(subGame[0].length>0){
                p1.push(p1card)
                p1.push(p2card)
            } else {
                p2.push(p2card)
                p2.push(p1card)
            }

        } else {

            if(p1card>p2card){
                p1.push(p1card)
                p1.push(p2card)
            } else {
                p2.push(p2card)
                p2.push(p1card)
            }

        }
        
    }

    return [p1,p2]
}

let p2Players = structuredClone(lines)
let p2result = playGame(p2Players)
console.log(p2result.flat().slice().reverse().map((x,ix)=> x*(ix+1)).reduce((acc,curr)=>acc+curr,0)) // Part 2 answer
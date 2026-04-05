const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2015/day22.txt', {encoding: "utf8", flag: "r", });

// Spells - Indexes: 0 - initialise, 1 - deactivate, 2 - active
const spells ={
    'missile':  [[[-53,0],[-4,0],[0,0,0]]], // Magic Missile
    'drain':    [[[-73,2],[-2,0],[0,0,0]]], // Drain
    'shield':   [[[-113,0],[0,-7],[6,0,0]],[[0,0],[0,7],[-1,0,0]],[[0,0],[0,0],[-1,0,0]]], // Shield
    'poison':   [[[-173,0],[0,0],[0,6,0]],[[0,0],[-3,0],[0,-1,0]],[[0,0],[-3,0],[0,-1,0]]], // Poison
    'recharge': [[[-229,0],[0,0],[0,0,5]],[[101,0],[0,0],[0,0,-1]],[[101,0],[0,0],[0,0,-1]]] // Recharge
}

const eKeys = ['shield','poison','recharge']
const allSpells = Object.keys(spells)

const update = (state,newState) => state.map((x,xi)=>x.map((y,yi)=> y+newState[xi][yi]))

const subTurns = {
    p2preTurn: ([me,enemy,effects]) => [me.with(1,me[1]-1),enemy,effects],
    preTurn: (state) => eKeys.flatMap((x,i) => state[2][i] === 0 ? [] : [spells[x][Math.min(2,state[2][i])]]).reduce((a,c)=>update(a,c),state),
    castSpell: (state,spell) => update(state,spells[spell][0]),
    enemyTurn: ([me,enemy,effects]) => [me.with(1,me[1]-Math.max(1,enemy[1])),enemy,effects]
}

const takeTurn = ([outcome,spend,state],spell,partNo) => {
    let order = ['preTurn','castSpell','preTurn','enemyTurn']

    if(partNo === 2) order.unshift('p2preTurn')

    do{
        let next = order.shift()
        state = subTurns[next](state,spell)
        if(next === 'castSpell') spend+=Math.abs(spells[spell][0][0][0])
    } while(order.length && state[0][1]>0 && state[1][0]>0)

    if(state[0][1]<=0) outcome = -1
    if(state[1][0]<=0) outcome = 1

    return [outcome,spend,state]
}

const solve = (partNo) => {
    let minSpend
    let queue = [[0,0,[[500,50,0],input.match(/\d+/g).map(Number),[0,0,0]]]]

    while(!minSpend){
        let curr = [cOutcome,cSpend,cState] = queue.shift()

        allSpells
            .filter((spell)=>
                cState[0][0]>=Math.abs(spells[spell][0][0][0]) // Can afford spell
                && (!eKeys.includes(spell)||cState[2][eKeys.indexOf(spell)] <=1)) // Not an active effect
            .forEach((spell)=>{
                let thisTurn = takeTurn(curr,spell,partNo)

                if(thisTurn[0] === 0){
                    queue.push(thisTurn)
                }
                
                if (thisTurn[0] === 1){
                    minSpend = thisTurn[1] // First found was answer for my input *shrug*
                }
        })
    }

    return minSpend
}
console.log(solve(1))
console.log(solve(2))
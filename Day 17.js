const fs = require('fs');
const input = fs.readFileSync('../day17input.txt',{ encoding: 'utf8' });
const parseRegex = /([A-Z]{2}|\d+)/g
let jets = input.split('').map((x)=> x === '<'?-1:1)
console.log(jets)

let nextRow = 0
let nextRock = 5
let endRock = 2021+nextRock
let seen = ['0-0','0-1','0-2','0-3','0-4','0-5','0-6']

function getRock(rockNumber,rowNumber){
    let rocks = new Map()
    // Put bottom at(0), topmost at(-1)
    rocks.set(0,[[rowNumber+4,2],[rowNumber+4,3],[rowNumber+4,4],[rowNumber+4,5]]) // row
    rocks.set(1,[[rowNumber+4,3],[rowNumber+5,2],[rowNumber+5,3],[rowNumber+5,4],[rowNumber+6,3]]) // cross
    rocks.set(2,[[rowNumber+4,2],[rowNumber+4,3],[rowNumber+4,4],[rowNumber+5,4],[rowNumber+6,4]]) // backwards L
    rocks.set(3,[[rowNumber+4,2],[rowNumber+5,2],[rowNumber+6,2],[rowNumber+7,2]]) // column
    rocks.set(4,[[rowNumber+4,2],[rowNumber+4,3],[rowNumber+5,2],[rowNumber+5,3]]) // block
    return rocks.get(rockNumber).slice(0)
}

function moveRock(rock,directionToggle){
    let nextPosition = rock
    if(directionToggle%2 === 0){ // move left/right
        let nextDir = jets.shift()
        
        if (rock.every(([r,c])=> 0<=c+nextDir && c+nextDir<=6 && !seen.includes(`${r}-${c+nextDir}`))){
            nextPosition = rock.map(([r,c])=>[r,c+nextDir])
        } 
        jets.push(nextDir)

    } else { // move down
        nextPosition = rock.map(([r,c])=>[r-1,c])
    }
    return nextPosition
}

function dropRock(rock){
    let direction = 0
    let position = rock
    //console.log('start position is ',position,' start direction is ',direction)

    do{
        nextMove = moveRock(position,direction)
        
        position = nextMove
        direction++
        //console.log('nextMove is now ',position,'direction is now ',direction)
    }while((direction%2 === 1 && !position.some(([r,c])=> seen.includes(`${r-1}-${c}`)))||direction%2 === 0)
    return position
}

//console.log('nextRock,nextRow',nextRock,nextRow)
let droppedRock

do {
    let thisRock = getRock(nextRock%5,nextRow)

    droppedRock = dropRock(thisRock)
    droppedRock.forEach(([r,c])=>seen.push(`${r}-${c}`))
    nextRock++
    if(droppedRock.at(-1)[0]>nextRow){
        nextRow = droppedRock.at(-1)[0]
    }

//console.log('droppedRock is ',droppedRock)
//console.log('nextRock,nextRow',nextRock,nextRow)


} while (nextRock<=endRock)

console.log(nextRow) // Part 1 answer

//Part 2
jets = input.split('').map((x)=> x === '<'?-1:1)
console.log(jets)

const fs = require('fs');
const input = fs.readFileSync('../day17input.txt',{ encoding: 'utf8' });

let jets = input.split('').map((x)=> x === '<'?-1:1)
let jetsIndex = jets.map((x,ix)=>ix)
let seen
let cycleKeys = []
let cycleInfo = []
let completeCycles = []
let completeCycleInfo = []
let firstCycle = {}

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
        let nextJetInd = jetsIndex.shift()
        
        if (rock.every(([r,c])=> 0<=c+nextDir && c+nextDir<=6 && !seen.includes(`${r}-${c+nextDir}`))){
            nextPosition = rock.map(([r,c])=>[r,c+nextDir])
        } 
        jets.push(nextDir)
        jetsIndex.push(nextJetInd)

    } else { // move down
        nextPosition = rock.map(([r,c])=>[r-1,c])
    }
    return nextPosition
}

function dropRock(rock,rockNo,height){
    let direction = 0
    let position = rock
    let jetSeen = []
    
    do{
        if(direction%2 === 0){
            jetSeen.push(jetsIndex[0])
        }
        nextMove = moveRock(position,direction)
        position = nextMove
        direction++
    } while((direction%2 === 1 && !position.some(([r,c])=> seen.includes(`${r-1}-${c}`)))||direction%2 === 0)
    
    let heightChange
    let newHeight
    
    if(position.at(-1)[0]>height){
        heightChange = position.at(-1)[0]-height
        newHeight = position.at(-1)[0]
    } else {
        heightChange = 0
        newHeight = height
    }

    cycleKeys.push(`${rockNo%5}_${jetSeen.join('_')}_${heightChange}`)
    cycleInfo.push([rockNo+1,newHeight,heightChange])

    if(rockNo%5 === 4 && firstCycle['firstCycleKey'] === undefined){ // Store every 5 rock lines to check for cycles
        if(completeCycles.lastIndexOf(cycleKeys.join('|')) !== -1){
            let cycleFound = completeCycles.lastIndexOf(cycleKeys.join('|'))

            //if(firstCycle['firstCycleKey'] === undefined){
                firstCycle['beforeFirstCycleKey'] = completeCycles[cycleFound-1].split('|')
                firstCycle['beforeFirstCycleInfo'] = completeCycleInfo[cycleFound-1]
                firstCycle['firstCycleKey'] = completeCycles[cycleFound].split('|')
                firstCycle['firstCycleInfo'] = completeCycleInfo[cycleFound]
                firstCycle['beforeCurrentCycleKey'] = completeCycles.at(-1).split('|')
                firstCycle['beforeCurrentCycleInfo'] = completeCycleInfo.at(-1)
                firstCycle['currentCycleKey'] = cycleKeys
                firstCycle['currentCycleInfo'] = cycleInfo.slice(0)
            //}

            completeCycles.push(cycleKeys.join('|'))
            completeCycleInfo.push(cycleInfo)
            cycleKeys = []
            cycleInfo = []

        } else {
            completeCycles.push(cycleKeys.join('|'))
            completeCycleInfo.push(cycleInfo)
            cycleKeys = []
            cycleInfo = []
        }

        
    }

    return position
}

function getHeight(numberOfRocks){
    jets = input.split('').map((x)=> x === '<'?-1:1)
    jetsIndex = jets.map((x,ix)=>ix)
    seen = ['0-0','0-1','0-2','0-3','0-4','0-5','0-6']
    let nextRow = 0
    let nextRock = 0
    let endRock = numberOfRocks-1
    let droppedRock

    while (nextRock<=endRock) {
        let thisRock = getRock(nextRock%5,nextRow)
        droppedRock = dropRock(thisRock,nextRock,nextRow)
        droppedRock.forEach(([r,c])=>seen.push(`${r}-${c}`))
        nextRock++
        if(droppedRock.at(-1)[0]>nextRow){
            nextRow = droppedRock.at(-1)[0]
        }    
    }

    return nextRow 
}

console.log(getHeight(2022)) // Part 1 answer

//Part 2

let offsetIndex

for(i=0;i<5;i++){ // Check if cycle started before first 5 rows detected
    let beforeFirstFiveKeys = firstCycle['beforeFirstCycleKey'].slice(i)
    let beforeFirstFiveInfo = firstCycle['beforeFirstCycleInfo'].slice(i)
    let beforeEndFiveKeys = firstCycle['beforeCurrentCycleKey'].slice(i)
    let beforeEndFiveInfo = firstCycle['beforeCurrentCycleInfo'].slice(i)

    if(beforeFirstFiveKeys.every((x,ix,arr)=> arr[ix] === beforeEndFiveKeys[ix]) && beforeFirstFiveInfo.every((y,yix,arr)=>arr[yix][2]===beforeEndFiveInfo[yix][2])){
        offsetIndex = i
        break;
    }
}

let [offsetRockNo,offsetRockHeight,offsetHeightIncrease] = offsetIndex !== undefined ? firstCycle['beforeFirstCycleInfo'][offsetIndex-1] : firstCycle['beforeFirstCycleInfo'][4]

let [startRockNo,startRockHeight,startHeightIncrease] = offsetIndex !== undefined ?firstCycle['beforeFirstCycleInfo'][offsetIndex] : firstCycle['firstCycleInfo'][0]

let [endRockNo,endRockHeight,endHeightIncrease] = offsetIndex !== undefined ? firstCycle['beforeCurrentCycleInfo'][offsetIndex] : firstCycle['currentCycleInfo'][0]

let cycleLength = endRockNo-startRockNo
let cycleHeight = endRockHeight-startRockHeight

let p2Rocks = 1000000000000-1
let numOfCycles = Math.floor((p2Rocks-offsetRockNo)/cycleLength)
let remainderRocks = p2Rocks - offsetRockNo - (numOfCycles*cycleLength)

let totalHeight = (cycleHeight*numOfCycles) + getHeight(startRockNo+remainderRocks)
console.log(totalHeight) // Part 2 answer
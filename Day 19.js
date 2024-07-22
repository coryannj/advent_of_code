const fs = require('fs');
const input = fs.readFileSync('../day19input.txt',{ encoding: 'utf8' });

let blueprints = input.split(/[\r\n]+/).map((x)=> x.match(/\d+/g).map((y)=> parseInt(y)))

let robotCost = {}

blueprints.forEach(([blueprint,oreCost,clayCost,obsOreCost,obsClayCost,geodeOreCost,geodeObsidianCost])=>{
    robotCost[blueprint] = {
        'oreRobot': oreCost,
        'clayRobot': clayCost,
        'obsidianRobot': [obsOreCost,obsClayCost],
        'geodeRobot': [geodeOreCost,geodeObsidianCost]
    }
})
//console.log([...Object.entries(robotCost)])



let allOre = [...new Set(blueprints.map((x)=>x[1]))].sort((a,b)=>a-b)
let allClay = [...new Set(blueprints.map((x)=>x[2]))].sort((a,b)=>a-b)

console.log(allOre)
console.log(allClay)

let oreRobots = {}
let oreClay = {}

// Across all blueprints, ore and clay robot costs are 2,3 or 4
// Pre-compute all ore robots for building 1/2/3 bots - output is array of how much ore at any given minute for cost/no. of bots
function buildOre(noToBuild,oreCost){
    for(i=0;i<noToBuild;i++){
        if(i===0){
            oreRobots[oreCost]={}
            oreRobots[oreCost][i+1] = {}
            oreRobots[oreCost][i+1]['ore'] = Array(33).fill('.').map((_,i)=>i)
            oreRobots[oreCost][i+1]['oreBuildIndex'] = [0]
        } else {
            let lastRobotBuilt = i
            let lastRobotOre = oreRobots[oreCost][lastRobotBuilt]['ore']
            let lastRobotIndex = oreRobots[oreCost][lastRobotBuilt]['oreBuildIndex']
            let buildIndex = lastRobotOre.findIndex((x,ix,arr)=> ix>lastRobotIndex.at(-1) && arr[ix-1]>=oreCost && x>=oreCost)
            let arr2 = lastRobotOre.slice(0,buildIndex)
            let arr3 = Array(lastRobotOre.length-arr2.length).fill(lastRobotOre[buildIndex]-oreCost).map((x,ix)=>((parseInt(lastRobotBuilt)+1)*ix)+x)
            oreRobots[oreCost][i+1] = {}
            oreRobots[oreCost][i+1]['ore'] = arr2.concat(arr3)
            oreRobots[oreCost][i+1]['oreBuildIndex'] = lastRobotIndex.concat(buildIndex)
        }
    }
}

allOre.forEach((ore,ix)=>{
    buildOre(4,ore)
})

let zeroArr = Array(33).fill(0)
let firstRobotArr = Array(33).fill('.').map((_,i)=>i)

function buildClay(noOfOreBots,oreCost,noToBuild,clayCost){
    for(j=0;j<noToBuild;j++){
        let oreClayKey = `${oreCost}-${noOfOreBots}-${clayCost}-${j+1}`
        let lastOreClayKey = `${oreCost}-${noOfOreBots}-${clayCost}-${j}`
        let thisOreBot = j===0 ? oreRobots[oreCost][noOfOreBots]['ore'] : oreClay[lastOreClayKey]['ore']
        let thisOreBuildIndex = j === 0 ? oreRobots[oreCost][noOfOreBots]['oreBuildIndex'] : oreClay[lastOreClayKey]['oreBuildIndex']
    
        let clayBuildIndex = thisOreBot.findIndex((x,ix,arr)=> ix > thisOreBuildIndex.at(-1) && arr[ix-1] >= clayCost && x >= clayCost)
        let newOre = thisOreBot.map((x,ix)=> ix >= clayBuildIndex ? x-clayCost : x )
        
        let lastClay = j === 0 ? zeroArr : oreClay[lastOreClayKey]['clay']
        let lastClayBuildIndex = j === 0 ? [] : oreClay[lastOreClayKey]['clayBuildIndex']
        //console.log('j is ',j,'claybuildIndex is ',clayBuildIndex,' lastClayBuildIndex is ',lastClayBuildIndex, 'newClayBuildIndex is ',lastClayBuildIndex.concat(clayBuildIndex))
        let nextClay = j === 0 ? firstRobotArr : Array(33).fill(lastClay[clayBuildIndex]).map((x,ix)=>((j+1)*ix)+x)

        let newClay = lastClay.slice(0,clayBuildIndex).concat(nextClay).slice(0,33)

        oreClay[oreClayKey] = {}
        oreClay[oreClayKey]['ore'] = newOre
        oreClay[oreClayKey]['oreBuildIndex'] = thisOreBuildIndex.concat(clayBuildIndex)
        oreClay[oreClayKey]['clay'] = newClay
        oreClay[oreClayKey]['clayBuildIndex'] = lastClayBuildIndex.concat(clayBuildIndex)
    }
}

Object.keys(oreRobots).forEach((oreCost)=>{
    Object.keys(oreRobots[oreCost]).forEach((noOfOreBots)=>{
        allClay.forEach((clayCost)=>{
            //console.log('oreCost is ',oreCost,' Number of ore robots is ',noOfOreBots, 'and clay cost is ',clayCost)
            buildClay(noOfOreBots,oreCost,5,clayCost)
        })
    })
})

console.log([...Object.entries(oreClay)].map(([k,v])=> {
    let lastIx = v['oreBuildIndex'].at(-1)
    v['timeTaken'] = lastIx
    return [k,v]
}).at(-1))

// Pre-compute ore x clay for 1/2/3/4/5 clay robots

let blueprintQueue = [...Object.entries(robotCost)].map(([k,v])=>[parseInt(k),v])
console.log(blueprintQueue)

function buildObsidian(oreClayObj,oreObsCost,clayObsCost){
    let thisOreClayObj = oreClayObj
    let thisOre = thisOreClayObj['ore']
    let thisClay = thisOreClayObj['clay']
    let lastRobotIndex = oreClayObj['oreBuildIndex']
    let obsBuildIndex = thisClay.findIndex((x,ix,arr)=>ix>lastRobotIndex.at(-1) && arr[ix-1]>=clayObsCost && arr[ix]>=clayObsCost && thisOre[ix-1]>=oreObsCost && thisOre[ix]>=oreObsCost)
    
    let newOre = thisOre.map((x,ix)=> ix >= obsBuildIndex ? x-obsOreCost : x )
    let newClay = thisClay.map((x,ix)=> ix >= obsBuildIndex ? x-obsClayCost : x )
    let lastObsBuildIndex = thisOreClayObj['obsidian'] === undefined ? [] : thisOreClayObj['obsBuildIndex']
    let lastObs = thisOreClayObj['obsidian'] === undefined ? zeroArr : thisOreClayObj['obsidian']
    let nextObs = thisOreClayObj['obsidian'] === undefined ? firstRobotArr : Array(33).fill(lastClay[obsBuildIndex]).map((x,ix)=>((j+1)*ix)+x)
    let newObs = lastObs.slice(0,obsBuildIndex).concat(nextObs).slice(0,33)

    let newRobotObj = {}
    newRobotObj['ore'] = newOre
    newRobotObj['oreBuildIndex'] = oreClayObj['oreBuildIndex'].concat(obsBuildIndex)
    newRobotObj['clay'] = newClay
    newRobotObj['clayBuildIndex'] = oreClayObj['clayBuildIndex'].concat(obsBuildIndex)
    newRobotObj['obsidian'] = newObs
    newRobotObj['obsidianBuildIndex'] = lastObsBuildIndex.concat(obsBuildIndex)

    if(oreClayObj['geodes'] !== undefined){
        newRobotObj['geodes'] = oreClayObj['geodes']
    }
    return newRobotObj
}





Object.keys(oreClay).forEach((ocKey)=>{
    let thisOre = oreClay[ocKey]['ore']
    let thisClay = oreClay[ocKey]['clay']
    let lastRobotIndex = oreClay[ocKey]['oreBuildIndex']
    let obsIndex = thisClay.findIndex((x,ix,arr)=>ix>lastRobotIndex.at(-1) && arr[ix-1]>=14 && arr[ix]>=14 && thisOre[ix-1]>=3 && thisOre[ix]>=3)
    console.log(ocKey,' first obs index is ',obsIndex)
})

allOre.forEach((oreCost)=>{
    allClay.forEach((clayCost)=>{
        let oreClayKeys = [...Object.entries(oreClay)].filter((entry)=>{
            let keySplit = entry[0].split('-').map(Number)
            return keySplit[0] === oreCost && keySplit[2] === clayCost
        })
        if(oreClayKeys.length>0){
            let obIndex = oreClayKeys.map(([key,obj])=>{
                let thisOre = obj['ore']
                let thisClay = obj['clay']
                let lastRobotIndex = obj['oreBuildIndex']
                return [key,thisClay.findIndex((x,ix,arr)=>ix>lastRobotIndex.at(-1) && arr[ix-1]>=14 && arr[ix]>=14 && thisOre[ix-1]>=3 && thisOre[ix]>=3)]
            })
            console.log('oreCost is ',oreCost,' clayCost is ',clayCost,' ',obIndex.sort((a,b)=>a[1]-b[1]))
        }
        

        
    })
})





// Blueprint 1:
//   Each ore robot costs 4 ore.
//   Each clay robot costs 2 ore.
//   Each obsidian robot costs 3 ore and 14 clay.
//   Each geode robot costs 2 ore and 7 obsidian.


// How fast can we build an obsidian robot?
// Should I build another ore robot? Or all clay

function clayMaxBuild(startTime,blueprintNo){
    let cost = robotCost[blueprintNo]['clayRobot']
    let time = Array(24-startTime).fill('.').map((_,i)=>i).map((x)=>(Math.floor((1/(cost))*x)))
    return time
}

console.log(clayMaxBuild(0,1))


let clay = [
    0, 0, 0, 1, 1, 2, 2, 3,
    3, 3, 3, 3, 4, 4, 4, 5,
    5, 5, 6, 6, 6, 7, 7, 7
  ]

let clayCount = [
    0, 0, 0, 0, 1, 2, 4, 7,
    8, 11, 14, 17, 21, 25, 29, ,
    5, 5, 6, 6, 6, 7, 7, 7
  ]


  let time = Array(33).fill('.').map((_,i)=>i)
  console.log(time)
  console.log(time.map((x,i)=>x-(clay[i]*2)))

// Max ore robot build rate = 1+Math.floor((1/(orecost+1))*t)
// Ore count = (t(now)-t(time robot(n) built))
// Max ore robots needed = 4

// Max clay robot build rate = Math.floor((1/(claycost+1))*t) = Math.floor(0.333333*t)
// c1 built t3 producing from t4
// c2 built t6 producing from t7


// Max obsidian robot build rate


console.log(time.map((x)=>(Math.floor((1/3)*x))))
console.log(time.map((x)=>1+Math.floor((1/5)*x)))

// Clay count = t *

let clayCount = [
    0, 0, 0, 1, 1, 1, 2, 2, 2,
    3, 3, 3, 4, 4, 4, 5, 5, 5,
    6, 6, 6, 7, 7, 7, 8, 8, 8,
    9, 9
  ]

let clay = new Map()

let clayBuildTimes = [...new Set(clayCount.map((x,i,arr)=> arr.indexOf(x)))].slice(1)
console.log(clayBuildTimes)

clayBuildTimes.forEach((time)=>clay.set(time,1))

console.log(clay)


function getGeodes(blueprint,maxTime){
    let [blueprintId,oreCost,clayCost,obsidianOreCost,obsidianClayCost,geodeOreCost,geodeObsidianCost] = blueprint

    // [timeElapsed, oreRobots,clayRobots,obsidianRobots,geodeRobots,oreCount,clayCount,obsidianCount,geodeCount]
    let queue = [[0,1,0,0,0,0,0,0,0]]

    let geodes = []

    let counter = 0

    while(queue.length>0){
        counter++
        let [timeElapsed, oreRobots,clayRobots,obsidianRobots,geodeRobots,oreCount,clayCount,obsidianCount,geodeCount] = queue.shift()

        console.log('**** NEW LOOP *****')
        console.log('[timeElapsed, oreRobots,clayRobots,obsidianRobots,geodeRobots,oreCount,clayCount,obsidianCount,geodeCount]')
        console.log(timeElapsed, oreRobots,clayRobots,obsidianRobots,geodeRobots,oreCount,clayCount,obsidianCount,geodeCount)
        if(counter%10000 === 0){
            console.log('counter is ',counter)
                    console.log('[timeElapsed, oreRobots,clayRobots,obsidianRobots,geodeRobots,oreCount,clayCount,obsidianCount,geodeCount]')
        console.log(timeElapsed, oreRobots,clayRobots,obsidianRobots,geodeRobots,oreCount,clayCount,obsidianCount,geodeCount)
            console.log('queue length is ',queue.length)
        }
        

        if(timeElapsed < maxTime-1){ // 2 minutes left
            let newTime = timeElapsed+1

            queue.push([newTime,oreRobots,clayRobots,obsidianRobots,geodeRobots,oreCount+(1*oreRobots),clayCount+(1*clayRobots),obsidianCount+(1*obsidianRobots),geodeCount+(1*geodeRobots)]) // Don't build a robot

            let buildRobot = {
                buildOre: [oreCount-oreCost],
                buildClay: [oreCount-clayCost],
                buildObsidian: [oreCount-obsidianOreCost,clayCount-obsidianClayCost],
                buildGeode: [oreCount-geodeOreCost,obsidianCount-geodeObsidianCost]
            }
            console.log('buildRobot is ',buildRobot)
            let canBuildRobot = Object.entries(buildRobot).filter((x)=> x[1].every((y)=> y>=0))

            console.log('canBuildRobot is ',canBuildRobot)
            if (canBuildRobot.length>0){
                canBuildRobot.forEach(([robotName,robotCost])=>{
                    if(robotName === 'buildOre'){
                        queue.push([newTime,oreRobots+1,clayRobots,obsidianRobots,geodeRobots,oreCount+(1*oreRobots)-oreCost,clayCount+(1*clayRobots),obsidianCount+(1*obsidianRobots),geodeCount+(1*geodeRobots)])
                    }

                    if(robotName === 'buildClay'){
                        queue.push([newTime,oreRobots,clayRobots+1,obsidianRobots,geodeRobots,oreCount+(1*oreRobots)-clayCost,clayCount+(1*clayRobots),obsidianCount+(1*obsidianRobots),geodeCount+(1*geodeRobots)])
                    }

                    if(robotName === 'buildObsidian'){
                        queue.push([newTime,oreRobots,clayRobots,obsidianRobots+1,geodeRobots,oreCount+(1*oreRobots)-obsidianOreCost,clayCount+(1*clayRobots)-obsidianClayCost,obsidianCount+(1*obsidianRobots),geodeCount+(1*geodeRobots)])
                    }

                    if(robotName === 'buildGeode'){
                        queue.push([newTime,oreRobots,clayRobots,obsidianRobots,geodeRobots+1,oreCount+(1*oreRobots)-geodeOreCost,clayCount+(1*clayRobots),obsidianCount+(1*obsidianRobots)-geodeObsidianCost,geodeCount+(1*geodeRobots)])
                    }
                })
            }
            // } else {
            //     queue.push([newTime,oreRobots,clayRobots,obsidianRobots,geodeRobots,oreCount+(1*oreRobots),clayCount+(1*clayRobots),obsidianCount+(1*obsidianRobots),geodeCount+(1*geodeRobots)])
            // }
        } else { // 1 min left - new robot won't affect scores
            let last = [timeElapsed+1,oreRobots,clayRobots,obsidianRobots,geodeRobots,oreCount+(1*oreRobots),clayCount+(1*clayRobots),obsidianCount+(1*obsidianRobots),geodeCount+(1*geodeRobots)]
            console.log('REACHED END, last is ',last)
            geodes.push(last.at(-1))
        }
        
    }
    return Math.max(...geodes)
}

console.log(getGeodes(blueprints[0],12))
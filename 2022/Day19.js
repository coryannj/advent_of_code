const fs = require('fs');
require("../utils.js");
const input = fs.readFileSync('../inputs/2022/day19.txt', {encoding: "utf8", flag: "r", });

let blueprints = input.split(/[\r\n]+/).map((x)=> x.match(/\d+/g).map((y)=> parseInt(y)))

console.log(blueprints.map((x)=>x.slice(1,5).join('-')).sort())

let blueprintKeys = Object.fromEntries(blueprints.map((x)=>[x.slice(1).join('-'),x[0]]))

let oreClayCombos = [...new Set(blueprints.map((x)=>`${x[1]}|${x[2]}`))].map((x)=>x.split('|').map(Number))

let triangular = Array(20).fill('.').map((x,ix)=> ix).cumSum()
console.log(triangular)

let oreClayQueue = []

oreClayCombos.forEach(([oCost,cCost])=>{
    let ocBlueprints = blueprints.filter(([id,oc,cc,obOre,obC,gOre,gOb])=>oc===oCost && cc === cCost)
    let startState = {
        time: 0,
        ore:1,
        clay:0,
        obsidian:0,
        geode: 0,
        oreTotal:[0],
        clayTotal:[0],
        obsidianTotal:[0],
        geodeTotal: 0,
        buildOrder:[`o${oCost}`],
        buildTimes:[],
        geodeBuildTimes:[],
        maxOre: Math.max(...ocBlueprints.flatMap(([id,oc,cc,obOre,obC,gOre,gOb])=>[obOre,gOre])),
        maxClay: Math.max(...ocBlueprints.flatMap(([id,oc,cc,obOre,obC,gOre,gOb])=>obC)),
        maxObsidian: Math.max(...ocBlueprints.flatMap(([id,oc,cc,obOre,obC,gOre,gOb])=>obC))
    }

    startState['oreCost'] = oCost
    startState['clayCost'] = cCost
    oreClayQueue.push(startState)
})

console.log(oreClayQueue)

const buildOre = (state) => {
    while(state.oreTotal.at(-1)<state.oreCost){
        state.oreTotal.push(state.oreTotal.at(-1)+state.ore)
        state.clayTotal.push(state.clayTotal.at(-1)+state.clay)
        state.obsidianTotal.push(state.obsidianTotal.at(-1)+state.obsidian)
        state.time++
    }

    state.oreTotal.push((state.oreTotal.at(-1))-state.oreCost+state.ore)
    state.clayTotal.push(state.clayTotal.at(-1)+state.clay)
    state.obsidianTotal.push(state.obsidianTotal.at(-1)+state.obsidian)
    state.time++
    state.ore++
    state.buildOrder.push( `o${state.oreCost}`)
    state.buildTimes.push(state.time)

    return state
}

const buildClay = (state) => {
    
    while(state.oreTotal.at(-1)<state.clayCost){
        state.oreTotal.push(state.oreTotal.at(-1)+state.ore)
        state.clayTotal.push(state.clayTotal.at(-1)+state.clay)
        state.obsidianTotal.push(state.obsidianTotal.at(-1)+state.obsidian)
        state.time++
    }
    //console.log('state after while',state)
    state.oreTotal.push((state.oreTotal.at(-1))-state.clayCost+state.ore)
    state.clayTotal.push(state.clayTotal.at(-1)+state.clay)
    state.obsidianTotal.push(state.obsidianTotal.at(-1)+state.obsidian)
    state.time++
    state.clay++
    state.buildOrder.push(`c${state.clayCost}`)
    state.buildTimes.push(state.time)

    return state
}

const buildObsidian = (state,obOreCost,obClayCost) => {

    if(obOreCost===undefined){
        obOreCost = state.obsidianCost[0]
        obClayCost = state.obsidianCost[1]
    }

    while(state.oreTotal.at(-1)<obOreCost||state.clayTotal.at(-1)<obClayCost){
        state.oreTotal.push(state.oreTotal.at(-1)+state.ore)
        state.clayTotal.push(state.clayTotal.at(-1)+state.clay)
        state.obsidianTotal.push(state.obsidianTotal.at(-1)+state.obsidian)
        state.time++
    }

    state.oreTotal.push((state.oreTotal.at(-1))-obOreCost+state.ore)
    state.clayTotal.push(state.clayTotal.at(-1)-obClayCost+state.clay)
    state.obsidianTotal.push(state.obsidianTotal.at(-1)+state.obsidian)
    state.time++
    state.obsidian++
    state.buildOrder.push(`ob${obOreCost}_${obClayCost}`)
    state.buildTimes.push(state.time)

    return state
}



const buildGeode = (state) =>{
    let gOreCost = state.geodeCost[0]
    let gObsCost = state.geodeCost[1]
    //console.log('buildGeode state',gOreCost,gObsCost,state)
    while(state.oreTotal.at(-1)<gOreCost||state.obsidianTotal.at(-1)<gObsCost){
        state.oreTotal.push(state.oreTotal.at(-1)+state.ore)
        state.clayTotal.push(state.clayTotal.at(-1)+state.clay)
        state.obsidianTotal.push(state.obsidianTotal.at(-1)+state.obsidian)
        state.time++
    }
    //console.log('geode state after while',state)
    state.oreTotal.push((state.oreTotal.at(-1))-gOreCost+state.ore)
    state.clayTotal.push(state.clayTotal.at(-1)+state.clay)
    state.obsidianTotal.push(state.obsidianTotal.at(-1)-gObsCost+state.obsidian)
    state.time++
    state.geode++
    state.buildOrder.push(`g${gOreCost}_${gObsCost}`)
    state.buildTimes.push(state.time)
    state.geodeBuildTimes.push(state.time)
    state.geodeTotal+= state.time<24 ? (24-state.time) : 0

    // if(state.oreCost === 3 && state.clayCost === 3 && state.geodeCost[0] === 2 && state.geodeCost[1] === 12){
    //     console.log('geode state after build',state)
    // }
    return state
}

let ocStateObj = {}
let cachehit = 0

while(oreClayQueue.length>0){
    let ognext = oreClayQueue.shift()
    if(ognext.time<=21){
        let next = JSON.parse(JSON.stringify(ognext))
        if(next.ore<next.maxOre){
                if(ocStateObj[`${next.buildOrder.join('-')}-o${next.oreCost}`]){
                    oreClayQueue.push(ocStateObj[`${next.buildOrder.join('-')}-o${next.oreCost}`])
                    cachehit++
                } else {
                    let nextOre = buildOre(next)
                    ocStateObj[`${nextOre.buildOrder.join('-')}`] = nextOre
                    oreClayQueue.push(nextOre)
                }
        }
    
        next = JSON.parse(JSON.stringify(ognext))
        
        if(next.clay<next.maxClay){
                if(ocStateObj[`$${next.buildOrder.join('-')}-c${next.clayCost}`]){
                    oreClayQueue.push(ocStateObj[`${next.buildOrder.join('-')}-c${next.clayCost}`])
                    cachehit++
                } else {
                    let nextClay = buildClay(next)
                    ocStateObj[`${nextClay.buildOrder.join('-')}`] = nextClay
                    oreClayQueue.push(nextClay)
                }
        }
    }


}

console.log(Object.keys(ocStateObj).length)

let obMin = {}
let obMinState = {}

oreClayCombos.forEach(([oc,cc])=>{
    let ocBlueprints = blueprints.filter(([id,oCost,cCost,obO,obC,gOre,gOb])=>oc===oCost && cc === cCost)
   // console.log('oc,cc',oc,cc)
    ocBlueprints.forEach(([id,oCost,cCost,obO,obC,gOre,gOb])=>{
    //    console.log('ob ore cost',obO,'ob clay cost',obC,'gOre cost',gOre,'gob cost',gOb)
        let maxOre = Math.max(obO,gOre)
        let maxClay = obC
        // let obEntries = Object.entries(ocStateObj).filter(([k,v])=>k.includes(`${oCost}-${cCost}|`) && v.clayTotal.at(-1) > 0 && v.clayTotal.at(-1)<=obC && v.ore<=maxOre).map((x)=>x[1])

        // let obCheck = Object.entries(ocStateObj).filter(([k,v])=>k.includes(`${oCost}-${cCost}|`) && v.clayTotal.at(-1) > 0 && v.clayTotal.at(-1)<=obC && v.ore<=maxOre)

        let obEntries = Object.entries(ocStateObj).filter(([k,v])=>k.includes(`${oCost}-${cCost}|`) && v.clay > 0).map((x)=>x[1])

        let obCheck = Object.entries(ocStateObj).filter(([k,v])=>k.includes(`${oCost}-${cCost}|`) && v.clay > 0)
        //obCheck.forEach((x)=>console.log(x))

        obCheck.forEach(([k,state],ix)=>{
            let obStateKey = `${oCost}-${cCost}-${obO}-${obC}-${gOre}-${gOb}`

            if(obMin[obStateKey] === undefined){
                obMin[obStateKey] = {}
            }
            state = JSON.parse(JSON.stringify(obEntries[ix]))
            state.maxOre = maxOre
            state.maxClay = maxClay
            state.maxObsidian = gOb
            state.obsidianCost = [obO,obC]
            state.geodeCost = [gOre,gOb]
            // while(state.oreTotal.at(-1)<obO||state.clayTotal.at(-1)<obC){
            //     state.oreTotal.push(state.oreTotal.at(-1)+state.ore)
            //     state.clayTotal.push(state.clayTotal.at(-1)+state.clay)
            //     state.time++
            // }

            let newstate = buildObsidian(state,obO,obC)



            if(!obMin[obStateKey]?.[newstate.time]){
                obMin[obStateKey][newstate.time] = [`${newstate.buildOrder.join('-')}`]
               
            } else {
                obMin[obStateKey][newstate.time].push(`${newstate.buildOrder.join('-')}`)
            }

            if(obMinState[obStateKey] === undefined){
                obMinState[obStateKey] = {}
            }
            if(obMinState[obStateKey][newstate.time] === undefined){
                obMinState[obStateKey][newstate.time] = {}
            }

            obMinState[obStateKey][newstate.time][`${newstate.buildOrder.join('-')}`] = newstate
            
        })
    })
})


//console.log('ob min states')
console.log(obMinState)


let obStates = {}


Object.keys(obMin).forEach((k)=>{
    let keyMap = k.split('-').map(Number)

    let getMin = Math.min(...Object.keys(obMin[k]).map(Number))
    obStates[k] = []

    console.log(k,'minTime is ',[getMin],'best obsidian mins ',21-getMin,'could build ',triangular[21-getMin],'of ',keyMap.at(-1))

    let minEntries = [...new Set(obMin[k][getMin].sort((a,c)=>c.length-a.length))]
  //  console.log('min Entries',minEntries)
    let max = minEntries.map((x)=>x.length)

    minEntries.forEach((mk)=>{

        if(max.includes(mk.length)){
            //console.log(k,k.length,mk,'buildTimes',obMinState[k][getMin][mk].buildTimes)
            obStates[k].push(obMinState[k][getMin][mk])
        }
    })

})


//console.log(obStates)
let obAllStates = {}
let p1 = {}
Object.keys(obStates).forEach((obk)=>{
    let queue = obStates[obk]
    let stateObj = {}
    console.log('obk is ',obk)
    while(queue.length>0){
        let ognext = queue.shift()
        console.log('next is ',ognext.buildOrder.join('-'))
        let next= JSON.parse(JSON.stringify(ognext))
        if(next.time<=22){
            next= JSON.parse(JSON.stringify(ognext))
            if(next.ore<next.maxOre+1){
                let nextOre = buildOre(next)
                
                if(nextOre.time<=22){
                    stateObj[`${nextOre.buildOrder.join('-')}`] = nextOre
                    queue.push(nextOre)
                }
            }
        
            next = JSON.parse(JSON.stringify(ognext))
            
            if(next.clay<next.maxClay+1){
                let nextClay = buildClay(next)
                
                if(nextClay.time<=22){
                    ocStateObj[`${nextClay.buildOrder.join('-')}`] = nextClay
                    queue.push(nextClay)
                }
            }
    
            next = JSON.parse(JSON.stringify(ognext))
            
            if(next.obsidian<next.maxObsidian+1){
                let nextObs = buildObsidian(next)
                
                if(nextObs.time<=22){
                    stateObj[`${nextObs.buildOrder.join('-')}`] = nextObs
                    queue.push(nextObs)
                }
            }
        }


        next = JSON.parse(JSON.stringify(ognext))
        if(next.time<24){
            let nextGeode = buildGeode(next)
            //console.log('next geode is ',nextGeode)
            
            
            if(nextGeode.time<24){
                stateObj[`${nextGeode.buildOrder.join('-')}`] = nextGeode
                queue.push(nextGeode)
            }
            
        }
    }
   // console.log('obk ',obk)
    //console.log(stateObj)
    let allGeodes = [...new Set(Object.entries(stateObj).filter(([sk,sv])=>sv.buildTimes.at(-1)<24).map(([sk,sv])=>sv.geodeTotal))].sortd()
    p1[obk] = allGeodes[0]

    console.log('max geodes is ',[...new Set(Object.entries(stateObj).filter(([sk,sv])=>sv.geodeBuildTimes.at(-1)<24).map(([sk,sv])=>sv.geodeTotal))].sortd())

    obAllStates[obk] = stateObj

})
//console.log(obAllStates)

//console.log(p1)

let p1Total = 0

Object.entries(p1).forEach(([pk,pv])=>{
    p1Total+=(blueprintKeys[pk]*pv)
})

console.log('p1Total is ',p1Total)

// const parseInput = input => input.split('\n').map(row => row.split(' ')).map(split => [
//     // ore, clay, obsidian, geode
//     [+split[6], 0, 0],
//     [+split[12], 0, 0],
//     [+split[18], +split[21], 0],
//     [+split[27], 0, +split[30]]
//  ]);
 
// //console.log(parseInput(input1))

//  const runPart1 = input => input.map(bp => {
//     const states = [{
//        resources: [0, 0, 0, 0],
//        robots: [1, 0, 0, 0],
//        time: 0
//     }];
//     let maxGeodes = 0;
//     const maxTime = 24;
//     const maxBots = [Math.max(...bp.map(cost => cost[0])), Math.max(...bp.map(cost => cost[1])), Math.max(...bp.map(cost => cost[2])), Infinity];
//     while (states.length > 0) {
//        const state = states.pop();
//        let {time} = state;
//        const {robots, resources} = state;
//        const geodes = resources[3] + robots[3] * (maxTime - time);
//        time++;
 
//        if (geodes > maxGeodes) {
//           maxGeodes = geodes;
//        }
 
//        if (time > maxTime) {
//           continue;
//        }
 
//        for (let i = 0; i < 4; i++) {
//           if (resources[i] >= maxBots[i]) {
//              continue;
//           }
//           const bpi = bp[i];
//           let timeToBuild = 0;
//           for (let j = 0; j < 3; j++) {
//              const timeForResource = Math.ceil((bpi[j] - resources[j]) / robots[j]);
//              if (timeForResource > timeToBuild) {
//                 timeToBuild = timeForResource;
//              }
//           }
 
//           if (timeToBuild > maxTime - time) {
//              continue;
//           }
 
//           const nextResources = [];
//           const nextRobots = [...robots];
 
//           for (let j = 0; j < 4; j++) {
//              nextResources[j] = resources[j] + robots[j] * (timeToBuild + 1) - (bpi[j] || 0);
//           }
 
//           nextRobots[i] += 1;
 
//           states.push({
//              resources: nextResources,
//              robots: nextRobots,
//              time: time + timeToBuild
//           });
//        }
//     }
//     console.log(bp.flat().filter((x)=>x!==0).join('-'),maxGeodes)
//     console.log(states)
//     return maxGeodes;
//  }).map((m, i) => m * (i + 1)).reduce((acc, curr) => acc + curr, 0);
 
// console.log(runPart1(parseInput(input1)))

//  const runPart2 = input => input.slice(0, 3).map(bp => {
//     const states = [{
//        resources: [0, 0, 0, 0],
//        robots: [1, 0, 0, 0],
//        time: 0
//     }];
//     let maxGeodes = 0;
//     const maxTime = 32;
//     const maxBots = [Math.max(...bp.map(cost => cost[0])), Math.max(...bp.map(cost => cost[1])), Math.max(...bp.map(cost => cost[2])), Infinity];
//     while (states.length > 0) {
//        const state = states.pop();
//        let {time} = state;
//        const {robots, resources} = state;
//        const geodes = resources[3] + robots[3] * (maxTime - time);
//        time++;
 
//        if (geodes > maxGeodes) {
//           maxGeodes = geodes;
//        }
 
//        if (time > maxTime) {
//           continue;
//        }
 
//        for (let i = 0; i < 4; i++) {
//           if (resources[i] >= maxBots[i]) {
//              continue;
//           }
//           const bpi = bp[i];
//           let timeToBuild = 0;
//           for (let j = 0; j < 3; j++) {
//              const timeForResource = Math.ceil((bpi[j] - resources[j]) / robots[j]);
//              if (timeForResource > timeToBuild) {
//                 timeToBuild = timeForResource;
//              }
//           }
 
//           if (timeToBuild > maxTime - time) {
//              continue;
//           }
 
//           const nextResources = [];
//           const nextRobots = [...robots];
 
//           for (let j = 0; j < 4; j++) {
//              nextResources[j] = resources[j] + robots[j] * (timeToBuild + 1) - (bpi[j] || 0);
//           }
 
//           nextRobots[i] += 1;
 
//           states.push({
//              resources: nextResources,
//              robots: nextRobots,
//              time: time + timeToBuild
//           });
//        }
//     }
//     return maxGeodes;
//  }).reduce((acc, curr) => acc * curr, 1);



//Advent of code 2022
//Day 19: Not Enough Minerals

// const part1 = (rawInput) => {
//     const blueprints = parseInput(rawInput);

//     let qualityLevel = 0;
//     for (const blueprint of blueprints) {
//         let q = testBlueprint(blueprint, 24)
//         console.log(`${blueprint.oreCost}-${blueprint.clayCost}-${blueprint.obsidianCost[0]}-${blueprint.obsidianCost[1]}-${blueprint.geodeCost[0]}-${blueprint.geodeCost[1]}`,': ',q)

//         qualityLevel += blueprint.number * q;
//     }
//     return qualityLevel;
// };

// const part2 = (rawInput) => {
//     const blueprints = parseInput(rawInput);

//     let result = 1;
//     for (let i = 0; i < 3; i++) {
//         result *= testBlueprint(blueprints[i], 32);
//     }
//     return result;
// };

// const testBlueprint = (blueprint, time) => {
//     let maxRobots = {
//         ore: Math.max(
//             blueprint.oreCost,
//             blueprint.clayCost,
//             blueprint.obsidianCost[0],
//             blueprint.geodeCost[0]
//         ),
//         clay: blueprint.obsidianCost[1],
//     };

//     let maxGeode = 0;
//     const search = (time, oreRobots, clayRobots, obsidianRobots, ore, clay, obsidian, geodes) => {
//         if (time < 1) return;

//         if (geodes + (time * (time + 1)) / 2 < maxGeode) {
//             return;
//         }
//         if (geodes > maxGeode) {
//             maxGeode = geodes;
//         }

//         //Build geode robot
//         if (obsidianRobots > 0) {
//             let canBuildGeodeNow =
//                 blueprint.geodeCost[0] <= ore && blueprint.geodeCost[1] <= obsidian;
//             let timeSkip =
//                 1 +
//                 (canBuildGeodeNow
//                     ? 0
//                     : Math.max(
//                           Math.ceil((blueprint.geodeCost[0] - ore) / oreRobots),
//                           Math.ceil((blueprint.geodeCost[1] - obsidian) / obsidianRobots)
//                       ));

//             search(
//                 time - timeSkip,
//                 oreRobots,
//                 clayRobots,
//                 obsidianRobots,
//                 ore + timeSkip * oreRobots - blueprint.geodeCost[0],
//                 clay + timeSkip * clayRobots,
//                 obsidian + timeSkip * obsidianRobots - blueprint.geodeCost[1],
//                 geodes + time - timeSkip
//             );

//             if (canBuildGeodeNow) return;
//         }

//         //Build obsidian robot
//         if (clayRobots > 0) {
//             let canBuildObsidianNow =
//                 blueprint.obsidianCost[0] <= ore && blueprint.obsidianCost[1] <= clay;
//             let timeSkip =
//                 1 +
//                 (canBuildObsidianNow
//                     ? 0
//                     : Math.max(
//                           Math.ceil((blueprint.obsidianCost[0] - ore) / oreRobots),
//                           Math.ceil((blueprint.obsidianCost[1] - clay) / clayRobots)
//                       ));

//             if (time - timeSkip > 2) {
//                 search(
//                     time - timeSkip,
//                     oreRobots,
//                     clayRobots,
//                     obsidianRobots + 1,
//                     ore + timeSkip * oreRobots - blueprint.obsidianCost[0],
//                     clay + timeSkip * clayRobots - blueprint.obsidianCost[1],
//                     obsidian + timeSkip * obsidianRobots,
//                     geodes
//                 );
//             }
//         }

//         //Build clay robot
//         if (clayRobots < maxRobots.clay) {
//             let canBuildClayNow = blueprint.clayCost <= ore;
//             let timeSkip =
//                 1 + (canBuildClayNow ? 0 : Math.ceil((blueprint.clayCost - ore) / oreRobots)); //Todo maybe add one here

//             if (time - timeSkip > 3) {
//                 search(
//                     time - timeSkip,
//                     oreRobots,
//                     clayRobots + 1,
//                     obsidianRobots,
//                     ore + timeSkip * oreRobots - blueprint.clayCost,
//                     clay + timeSkip * clayRobots,
//                     obsidian + timeSkip * obsidianRobots,
//                     geodes
//                 );
//             }
//         }

//         //Build ore robot
//         if (oreRobots < maxRobots.ore) {
//             let canBuildOreNow = blueprint.oreCost <= ore;
//             let timeSkip =
//                 1 + (canBuildOreNow ? 0 : Math.ceil((blueprint.oreCost - ore) / oreRobots)); //Todo maybe add one here

//             if (time - timeSkip > 4) {
//                 search(
//                     time - timeSkip,
//                     oreRobots + 1,
//                     clayRobots,
//                     obsidianRobots,
//                     ore + timeSkip * oreRobots - blueprint.oreCost,
//                     clay + timeSkip * clayRobots,
//                     obsidian + timeSkip * obsidianRobots,
//                     geodes
//                 );
//             }
//         }
//     };

//     search(time, 1, 0, 0, 0, 0, 0, 0);
//     //console.log('Blueprint max: ' + maxGeode);
//     return maxGeode;
// };

// const parseInput = (rawInput) =>
//     rawInput.split('\n').map((blueprint) => {
//         let bp = blueprint.match(/\d+/g);
//         return new Blueprint(bp[0], bp[1], bp[2], [bp[3], bp[4]], [bp[5], bp[6]]);
//     });

// class Blueprint {
//     constructor(blueprintNum, oreCost, clayCost, obsidianCost, geodeCost) {
//         this.number = blueprintNum;
//         this.oreCost = oreCost;
//         this.clayCost = clayCost;
//         this.obsidianCost = obsidianCost;
//         this.geodeCost = geodeCost;
//     }
// }

// console.log(part1(input))
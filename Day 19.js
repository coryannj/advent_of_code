const fs = require('fs');
const input = fs.readFileSync('../day19input.txt',{ encoding: 'utf8' });

let blueprints = input.split(/[\r\n]+/).map((x)=> x.match(/\d+/g).map((y)=> parseInt(y)))
//console.log(blueprints)


// Blueprint 1:
//   Each ore robot costs 4 ore.
//   Each clay robot costs 2 ore.
//   Each obsidian robot costs 3 ore and 14 clay.
//   Each geode robot costs 2 ore and 7 obsidian.

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
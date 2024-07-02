const fs = require('fs');
const input = fs.readFileSync('../day16input.txt',{ encoding: 'utf8' });
const parseRegex = /([A-Z]{2}|\d+)/g
const lines = input.split(/[\r\n]+/).map((y)=>y.match(parseRegex))

let tunnelMap = {}
let valveMap = {}
let newMap = {}

lines.forEach((line,idx)=>{
    valveMap[line[0]]=parseInt(line[1])
    let tunnels = line.slice(2)
    tunnelMap[line[0]] = tunnels
})

// All pairs shortest paths - add 1 to dist as we're going to turn every valve on
let shortMap = {}

function shortestAll(startNode){
    let sQueue = [[0,startNode]]
    let qseen = []
    qseen.push(startNode)
    
    while(sQueue.length>0){
        let last = sQueue.shift()
        let nextTunnels = tunnelMap[last.at(-1)].filter((x)=> !qseen.includes(x))
        last[0]++
        nextTunnels.forEach((nextT)=>{
                
                if(valveMap[nextT] !== 0){
                    if (shortMap[last.at(1)]===undefined){
                        shortMap[last.at(1)] = {} 
                    }
                    if(shortMap[last.at(1)][nextT] === undefined){
                        shortMap[last.at(1)][nextT]=[last[0]+1,valveMap[nextT]]
                    }
                    
                } 
                sQueue.push(last.concat(nextT))
                qseen.push(nextT)
            
        })
    }
}

Object.keys(valveMap).filter((x)=>valveMap[x]>0||x==='AA').forEach((valve)=>shortestAll(valve))


function getPaths(startNode,maxTime,minLen,maxLen,allormax){
    let pqueue = [[0,0,startNode]]
    let paths = []
    let maxFlow = 1000 // Don't return paths below this
    let counter = 0

    while(pqueue.length>0){
        counter++
        let [time,flow,valves] = pqueue.shift()
        let lastValve = valves.at(-1)

        let nextTunnels = Object.entries(shortMap[lastValve]).filter(([nextKey,[nextDist,nextFlow]])=> !valves.includes(nextKey) && (time+nextDist)<=maxTime)

        if (nextTunnels.length === 0){
            if(valves.length>=minLen && valves.length<=maxLen){
                if(allormax === 'max'){
                    if(flow>=maxFlow){
                        //maxFlow = flow
                        paths.push([time,flow,valves])
                        //console.log('new max found on iteration - no nextTunnels',counter,[time,flow,valves])
                    }
                } else {
                    paths.push([time,flow,valves])
                }

            }
        } else {
            nextTunnels.forEach(([nextKey,[nextDist,nextFlow]])=>{
                let nextTime = time + nextDist
                let timeRemaining = maxTime-nextTime
                let addFlow = flow + (timeRemaining*nextFlow)

                if(valves.length<maxLen-1){
                    if(valves.length>=minLen){
                        if(allormax === 'max'){
                            if(addFlow>=maxFlow){
                                //maxFlow = addFlow
                                paths.push([nextTime,addFlow,valves.concat(nextKey)])
                                //console.log('new max found on iteration - above minLen',counter,[nextTime,addFlow,valves.concat(nextKey)])
                            }
                        } else {
                            paths.push([nextTime,addFlow,valves.concat(nextKey)])
                        }

                    }
                    pqueue.push([nextTime,addFlow,valves.concat(nextKey)])
                } else {
                    if(allormax === 'max'){
                        if(addFlow>=maxFlow){
                            //maxFlow = addFlow
                            paths.push([nextTime,addFlow,valves.concat(nextKey)])
                            //console.log('new max found on iteration - reached maxLen',counter,[nextTime,addFlow,valves.concat(nextKey)])
                        }
                    } else {
                        paths.push([nextTime,addFlow,valves.concat(nextKey)])
                    }

                    
                }


            })
        }
    }
    return paths
}

console.log('*** Part 1 ***')
console.log([...getPaths(['AA'],30,7,8,'max')].map((x)=>x[1]).sort((a,b)=>b-a).at(0))

console.log('*** Part 2 ***')
console.log([...getPaths(['AA'],26,7,8,'max')].sort((a,b)=>b[1]-a[1]).map((path,ind,arr)=>{
    let disjoint = arr.find((dpath,ix)=> ix !== ind && dpath[2].slice(1).every((key)=> !path[2].includes(key)))
    //console.log('[time,flow,keys]',path)
    //console.log('disjoint is ',disjoint)
    return disjoint === undefined ? path[1] : path[1]+disjoint[1]
}).sort((a,b)=>b-a).at(0))
const fs = require('fs');
const { before } = require('node:test');
const input = fs.readFileSync('../day19input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/\n\n/)

const scanners = lines.map((x)=>x.split(/[\r\n]+/).slice(1)).map((x)=>x.map((y,yidx)=>[yidx,y.split(',').map(Number)]))

const rotations = ([x,y,z]) => [
    [x,y,z],    [x,z,-y],   [x,-y,-z],  [x,-z,y],
    [-x,-y,z],  [-x,z,y],   [-x,y,-z],  [-x,-z,-y],  
    [y,z,x],    [y,x,-z],   [y,-z,-x],  [y,-x,z],
    [-y,-z,x],  [-y,x,z],   [-y,z,-x],  [-y,-x,-z],
    [z,x,y],    [z,y,-x],   [z,-x,-y],  [z,-y,x],
    [-z,-x,y],  [-z,y,x],   [-z,x,-y],  [-z,-y,-x]
]

const pairDistance = ([px1,py1,pz1],[px2,py2,pz2]) => [Math.pow(Math.abs(px2-px1),2),Math.pow(Math.abs(py2-py1),2),Math.pow(Math.abs(pz2-pz1),2)]

let distMap = {} // distances between all pairs of points
let scannerMap = {} // points for each scanner

let scan = structuredClone(scanners)

scan.forEach((x,sidx)=>{
    distMap[sidx] = {}
    scannerMap[sidx] = {}
    while(x.length>0){
        let [bidx,bPoints] = x.shift()
        scannerMap[sidx][bidx] = bPoints
        x.forEach(([oidx,oPoints])=>{
        distMap[sidx][`${bidx}-${oidx}`] = pairDistance(bPoints,oPoints)
         })
    }
})

const findScanner = ([ref1,ref2],[over1,over2]) =>{
    let over1Rotations = rotations(over1).map((x)=>pairDistance(ref1,x))
    let over2Rotations = rotations(over2).map((x)=>pairDistance(ref2,x))

    let rotationIndex = over1Rotations.findIndex((x,ix)=> x.every((v,vx)=> v === over2Rotations[ix][vx]))

    if(rotationIndex === -1){
        return []
    } else {
        let correctRotation = rotations(over1)[rotationIndex]

        return [rotationIndex,ref1.map((x,ix)=>x-correctRotation[ix])]
    }

}

const toScanner0 = (scannerIndex,[rotationIndex,scanner]) => {
    Object.keys(scannerMap[scannerIndex]).forEach((key)=>{
        scannerMap[scannerIndex][key] = rotations(scannerMap[scannerIndex][key])[rotationIndex].map((x,ix)=>x+scanner[ix])
    })

    distMap[scannerIndex] = {}
    let newPoints = Object.entries(scannerMap[scannerIndex])

    while(newPoints.length>0){
        let [bidx,bPoints] = newPoints.shift()
       
        newPoints.forEach(([oidx,oPoints])=>{
            distMap[scannerIndex][`${bidx}-${oidx}`] = pairDistance(bPoints,oPoints)
         })
    }

}

let queue = ['0']
let seen = []
let beaconList = []
let scannerList = []

while(queue.length>0){
    let refScanner = queue.shift()
    seen.push(refScanner)

    let refBeacons = Object.entries(distMap[refScanner])

    let otherBeacons = Object.keys(distMap).filter((x)=> !seen.includes(x) && !queue.includes(x)).map((x)=>[x,Object.entries(distMap[x])])

    otherBeacons.forEach(([oidx,oBeacons])=>{

        let thisOverlap = refBeacons.flatMap(([rKey,rDist])=>{
            let sameDist = oBeacons.find(([oKey,oDist])=>[...new Set(rDist.concat(oDist))].length === 3)

            if(sameDist === undefined){
                return []
            } else {
                return[[[rKey,rDist],sameDist]]
            }

        })

        let setOverlaps = [...new Set(thisOverlap.flatMap((x)=>x[0][0].split('-')))].sort((a,b)=>a.localeCompare(b)).map((y)=>`${refScanner}-${y}`)
        
        if(setOverlaps.length > 11){

            setOverlaps.forEach((x)=>beaconList.push(x))

            let scannerObj = []
            while(scannerObj.length === 0){
                let [[firstKeys,firstOverlaps],[matchKeys,matchOverlaps]] = thisOverlap.shift()
                let firstKeySplit = firstKeys.split('-').map((x)=>scannerMap[refScanner][x])
                let matchKeySplit = matchKeys.split('-').map((x)=>scannerMap[oidx][x])

                scannerObj = findScanner(firstKeySplit,matchKeySplit)
            }

            toScanner0(oidx,scannerObj)
            scannerList.push(scannerObj[1])
            
            if(!queue.includes(oidx) && !seen.includes(oidx)){
                queue.push(oidx)
            }
        }

   })
}

let fullList = [...new Set(Object.keys(scannerMap).flatMap((x)=>Object.values(scannerMap[x])).map((y)=>y.join('_')))]

console.log(fullList.length) // Part 1 answer

// Part 2
const manhattan = (s1,s2) => s1.map((x,ix)=>Math.abs(x-s2[ix])).reduce((acc,curr)=>acc+curr,0)

let largestDist = 0

while(scannerList.length>0){
    let thisScanner = scannerList.shift()

    scannerList.forEach((otherScanner)=>{
        let dist = manhattan(thisScanner,otherScanner)
        if(dist>largestDist){
            largestDist = dist
        }
    })
}

console.log(largestDist) // Part 2 answer
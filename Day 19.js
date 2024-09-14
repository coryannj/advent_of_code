const fs = require('fs');
const { before } = require('node:test');
const input = fs.readFileSync('../day19input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/\n\n/)

const scanners = lines.map((x)=>x.split(/[\r\n]+/).slice(1)).map((x)=>x.map((y,yidx)=>[yidx,y.split(',').map(Number)]))

// Part 1
let scannerLen = scanners.length

// From https://imgur.com/Ff1vGT9
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

scanners.forEach((x,sidx)=>{
    distMap[sidx] = {}
    scannerMap[sidx] = Object.fromEntries(x)
    while(x.length>0){
        let [bidx,bPoints] = x.shift()
        x.forEach(([oidx,oPoints])=>{
        distMap[sidx][`${bidx}-${oidx}`] = pairDistance(bPoints,oPoints)
         })
    }
})

/* 
    **** Finding correct rotation ****

    - We have found matching pairs of points with same distance i.e.:
        - Scanner 1: [point A, point B] with distAB as [ABx,ABy,ABz] - our reference scanner
        - Scanner 2: [point C, point D] with distCD as [CDx,CDy,CDz]
        - Where distAB === distCD for all axes
    - So we know point A is point C and point B is point D where C and D have some rotation and offset 
    - This means correct rotation is where dist AC === dist BD for all axes
    - So to find correct rotation:
        - Generate all rotations for Point C and Point D
        - Calculate distAC and distBD accordingly
        - Check for some rotation index where dist AC === dist BD
        - If no index found try opp pairing i.e. AD and BC
    - Note: For generalised solution I think you'd need to expand to 3 points per scanner - but assumption is that the input was kind :-)
*/
const findScanner = ([[ref1,ref2],[over1,over2]]) =>{
    let opp = false
    let over1Rotations = rotations(over1).map((x)=>pairDistance(ref1,x))
    let over2Rotations = rotations(over2).map((x)=>pairDistance(ref2,x))
    let rotationIndex = over1Rotations.findIndex((x,ix)=> x.every((v,vx)=> v === over2Rotations[ix][vx]))

    if(rotationIndex === -1){
        opp = true
        over1Rotations = rotations(over1).map((x)=>pairDistance(ref2,x))
        over2Rotations = rotations(over2).map((x)=>pairDistance(ref1,x))
        rotationIndex = over1Rotations.findIndex((x,ix)=> x.every((v,vx)=> v === over2Rotations[ix][vx]))
    } 
    
    let correctRotation = rotations(over1)[rotationIndex]

    return (opp) ? [rotationIndex,ref2.map((x,ix)=>x-correctRotation[ix])] : [rotationIndex,ref1.map((x,ix)=>x-correctRotation[ix])]
}

// Once we've found correct rotation - update all points and pair distances for that scanner from position of Scanner 0
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
let scannerList = []

while(queue.length+seen.length<scannerLen){
    let refScanner = queue.shift()
    seen.push(refScanner)

    let refBeacons = Object.entries(distMap[refScanner])

    let otherBeacons = Object.keys(distMap).filter((x)=> !seen.includes(x) && !queue.includes(x)).map((x)=>[x,Object.entries(distMap[x])])

    otherBeacons.forEach(([oidx,oBeacons])=>{

        let refLen = refBeacons.length-1
        let thisOverlap = []

        // Check for overlaps
        for(i=refLen;i>=0;i--){
            let [rKey,rDist] = refBeacons[i] 
            let sameDist = oBeacons.find(([oKey,oDist])=>[...new Set(rDist.concat(oDist))].length === 3)

            if(sameDist !== undefined){
                thisOverlap.push([rKey.split('-').map((x)=>scannerMap[refScanner][x]),sameDist[0].split('-').map((x)=>scannerMap[oidx][x])])
            }

            if((thisOverlap.length+i)< 65||thisOverlap.length>=65){
                break;
            }
        }

        // If min number of overlaps found, get rotation and scanner by checking first pair of matching points
        if(thisOverlap.length >= 65){
            let scannerObj = findScanner(thisOverlap[0])

            toScanner0(oidx,scannerObj) // update all points and all pair distances to Scanner 0 rotation
            scannerList.push(scannerObj[1])
            
            if(!queue.includes(oidx) && !seen.includes(oidx)){
                queue.push(oidx) // Push found scanner to queue
            }
        }

   })
}

let fullList = new Set(Object.keys(scannerMap).flatMap((x)=>Object.values(scannerMap[x])).map((y)=>y.join('_')))

console.log(fullList.size) // Part 1 answer

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
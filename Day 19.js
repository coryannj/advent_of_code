const fs = require('fs');
const { before } = require('node:test');
const input = fs.readFileSync('../day19input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/\n\n/)

const scanners = lines.map((x)=>x.split(/[\r\n]+/).slice(1)).map((x)=>x.map((y,yidx)=>[yidx,y.split(',').map(Number)]))

const rotations = ([x,y,z]) => [
    [x,y,z],[x,z,-y],[x,-y,-z],[x,-z,y],
    [-x,-y,z],[-x,z,y],[-x,y,-z],[-x,-z,-y],
    [y,z,x],[y,x,-z],[y,-z,-x],[y,-x,z],
    [-y,-z,x],[-y,x,z],[-y,z,-x],[-y,-x,-z],
    [z,x,y],[z,y,-x],[z,-x,-y],[z,-y,x],
    [-z,-x,y],[-z,y,x],[-z,x,-y],[-z,-y,-x]
]

const distances = ([x,y,z]) => [
    [x,y,z],[x,z,y],
    [y,x,z],[y,z,x],
    [z,x,y],[z,y,x]
]


let distMap = {}

let scan = scanners.slice()

scan.forEach((scanner,sidx)=>{
    //distMap[sidx] = {}
    let scanidx = 0

    while(scanidx<scanner.length-1){
        let [bidx,[bx,by,bz]] = scanner[scanidx]

        let otherBeacons = scanner.slice(scanidx+1)

        otherBeacons.forEach(([oidx,[ox,oy,oz]])=>{
            
        let boDist = distances([Math.abs(bx-ox),Math.abs(by-oy),Math.abs(bz-oz)])

        boDist.forEach((dist,didx)=>{
            distMap[`${sidx}-didx${didx}-${bidx}-${oidx}`] = dist
        })


            
        })
        scanidx++
        
    }

})

//console.log(distMap)


let beaconMap = {}
let allEntries = Object.entries(distMap)


allEntries.forEach(([k,v])=>{
    if(beaconMap[`${v.join('-')}`]=== undefined){
        beaconMap[`${v.join('-')}`] = []
    }
    beaconMap[`${v.join('-')}`].push(k)
})

console.log(Object.entries(beaconMap).filter(([k,x])=>x.length>=2))

let allOverlapsZero = Object.values(beaconMap).filter((v)=>v.length>=2 && v.some((vk)=> vk.charAt(0)==='0')).flat().flatMap((x)=>{
    let [scanidx,didx,b1,b2] = x.split('-')
    return [`${scanidx}-${b1}`,`${scanidx}-${b2}`]
})

let allOverlapsNotZero = Object.values(beaconMap).filter((v)=>v.length>=2 && v.every((vk)=> vk.charAt(0) !== '0')).flat().flatMap((x)=>{
    let [scanidx,didx,b1,b2] = x.split('-')
    return [`${scanidx}-${b1}`,`${scanidx}-${b2}`]
})

let allOverlaps = Object.values(beaconMap).filter((v)=>v.length>=2).flat().flatMap((x)=>{
    let [scanidx,didx,b1,b2] = x.split('-')
    return [`${scanidx}-${b1}`,`${scanidx}-${b2}`]
})

console.log([...new Set(allOverlapsZero)].length)
console.log([...new Set(allOverlapsNotZero)].length)
console.log([...new Set(allOverlaps)].length)

let scanner0 = new Set(Object.values(distMap[0]).map((x)=>x.join('-')))
let scanner1 = new Set(Object.values(distMap[1]).map((x)=>x.join('-')))
let intersect = [...scanner0.intersection(scanner1)]
console.log(Object.keys(distMap[0]).filter((x)=> intersect.includes(distMap[0][x].join('-'))).length)
let scanner1Intersect = Object.keys(distMap[0]).filter((x)=> intersect.includes(distMap[0][x].join('-'))).flatMap((x)=>x.split('-'))
console.log([...new Set(scanner1Intersect)].map(Number).map((x)=>scanners[0][x]))

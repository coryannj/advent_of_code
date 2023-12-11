const fs = require('fs');
const input = fs.readFileSync('../day5input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/[\r\n]+/)
const splitregex = /[\w\s]+(?=[\|]|$)/gm
mapregex = /(?<=\w:)[\d\]+[\d\s]+/gm
const numregex = /\d+/gm

//Part 1
let megamap = input.match(mapregex)

const seedInt = megamap[0].match(numregex).map((x) => parseInt(x))

let seedsoil = megamap[1].trim().split(/[\r\n]+/).map((x) => x.match(numregex)).map((x)=> x.map((y) => parseInt(y)))
let soilfert = megamap[2].trim().split(/[\r\n]+/).map((x) => x.match(numregex)).map((x)=> x.map((y) => parseInt(y)))
let fertwater = megamap[3].trim().split(/[\r\n]+/).map((x) => x.match(numregex)).map((x)=> x.map((y) => parseInt(y)))
let waterlight = megamap[4].trim().split(/[\r\n]+/).map((x) => x.match(numregex)).map((x)=> x.map((y) => parseInt(y)))
let lighttemp = megamap[5].trim().split(/[\r\n]+/).map((x) => x.match(numregex)).map((x)=> x.map((y) => parseInt(y)))
let temphumid = megamap[6].trim().split(/[\r\n]+/).map((x) => x.match(numregex)).map((x)=> x.map((y) => parseInt(y)))
let humidlocation = megamap[7].trim().split(/[\r\n]+/).map((x) => x.match(numregex)).map((x)=> x.map((y) => parseInt(y)))

// Does one map
function getMapValue(value,mapArray) {
  let inMap = mapArray.filter((x) => x[1] < value && (x[1]+x[2])>value).flat()
  let toMapValue
  if (inMap.length > 0) {
    let increment = value - inMap[1]
    toMapValue = inMap[0] + increment    
  } else {
    toMapValue = value
  }
  return toMapValue
}

// Gets location value for a seed value
function seedlocation(seed) {
  let step1 = getMapValue(seed,seedsoil)
  let step2 = getMapValue(step1,soilfert)
  let step3 = getMapValue(step2,fertwater)
  let step4 = getMapValue(step3,waterlight)
  let step5 = getMapValue(step4,lighttemp)
  let step6 = getMapValue(step5,temphumid)
  let step7 = getMapValue(step6,humidlocation)
  return step7
}

// Part 1 answer
console.log(Math.min(...seedInt.map((x) => seedlocation(x))))

// Part 2

let seeds = []
let seedpair = []
for ([index,val] of seedInt.entries()) {
  if (index%2 != 1) {
    seedpair = []
    seedpair.push(val)
  } else {
    seedpair.push(val)
    seeds.push(seedpair)
  }
}

// Gets single map in reverse e.g. soil to seed
function getReverseMapValue(value,mapArray) {
  let inMap = mapArray.filter((x) => x[0] <= value && (x[0]+x[2])>=value).flat()
  let toMapValue
  if (inMap.length > 0) {
    let increment = value - inMap[0]
    toMapValue = inMap[1] + increment    
  } else {
    toMapValue = value
  }
  return toMapValue
}

// Gets single seed value for location value input
function locationseed(location) {
  //let step0 = getReverseMapValue(location,humidlocation) - not needed for location < 1094349260
  //let step1 = getReverseMapValue(step0,temphumid)
  let step1 = getReverseMapValue(location,temphumid)
  let step2 = getReverseMapValue(step1,lighttemp)
  let step3 = getReverseMapValue(step2, waterlight)
  let step4 = getReverseMapValue(step3,fertwater)
  let step5 = getReverseMapValue(step4,soilfert)
  let step6 = getReverseMapValue(step5,seedsoil)
  return step6
}

let j = 1094349260 // too lazy to code it - but in humidlocation map 0 -> 1094349260 is not ranged

// HOLD ONTO YOUR BUTTS
for(let i=1;i<j;i++) {
  let seed = locationseed(i)
  if (seeds.filter((x) => x[0] <= seed && (x[0]+x[1])>=seed).length > 0) {
    console.log('seed is',seed,'i is ',i) // i is Part 2 answer
    break
  }
}

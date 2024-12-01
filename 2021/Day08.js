const fs = require('fs');
const input = fs.readFileSync('../day8input.txt',{ encoding: 'utf8', flag: 'r' });
const numRegex = new RegExp(/\d+/, 'g');

let lines = input.split(/[\r\n]+/).map((x)=>x.split('|').map((y)=>y.trim().split(' ')))

let output = lines.flatMap((x)=> x[1].map((y)=>y.length)).filter((w)=> [2,3,4,7].includes(w))
console.log(output.length) // Part 1

let resultArr = []

lines.forEach(([signalList,outputs])=>{
    let signals = signalList.map((x)=> x.split('').sort((a,b)=>a.localeCompare(b)))
    signals.sort((a,b)=> a.length-b.length)

    let numberObj = {
        1: signals[0],
        4: signals[2],
        7: signals[1],
        8: signals.at(-1)
    }

    let position = {
        top:numberObj[7].find((x)=>!numberObj[1].includes(x)),
    }

    numberObj[9] = signals.filter((y)=>y.length===6).find((x)=>{
        let xSet = new Set(x)
        let foursevencheck = new Set(numberObj[4].concat(numberObj[7]))
        let xSetDiff = xSet.difference(foursevencheck)
        position['bottom'] = [...xSetDiff.values()].at(0)
        return xSetDiff.size === 1
    })

    numberObj[3] = signals.filter((x)=>x.length===5).find((x)=>{
        let tset = new Set(x)
        let nineset = new Set(numberObj[9])
        let setDiff = nineset.difference(tset)
        let topLVal = [...setDiff.values()].at(0)
        position['topleft']=topLVal
        return nineset.isSupersetOf(tset) === true && !numberObj[1].includes(topLVal)
    })

    position['middle'] = numberObj[4].find((x)=> !numberObj[1].includes(x) && x !== position['topleft']);
    numberObj[5] = signals.find((x)=>x.length === 5 && x.includes(position['topleft']));
    numberObj[0] = signals.find((x)=>x.length === 6 && !x.includes(position['middle']));
    numberObj[2] = signals.find((x)=>x.length === 5 && !x.includes(position['topleft']) && numberObj[1].some((y)=> !x.includes(y)));
    numberObj[6] = signals.find((x)=>x.length === 6 && numberObj[1].some((y)=> !x.includes(y)));
    let reverseMap = {}

    Object.entries(numberObj).forEach(([key,val])=>reverseMap[`${val.join('')}`]=key.toString())

    let outputSplit = outputs.map((y)=>y.split('').sort((a,b)=>a.localeCompare(b))).map((x)=>reverseMap[`${x.join('')}`])
    resultArr.push(parseInt(outputSplit.join('')))

})
console.log(resultArr.reduce((acc,curr)=>acc+curr)) // Part 2 answer


const fs = require('fs');
const input = fs.readFileSync('../day16input.txt',{ encoding: 'utf8', flag: 'r' });

let hexToBinary = {
    0 : '0000',
    1 : '0001',
    2 : '0010',
    3 : '0011',
    4 : '0100',
    5 : '0101',
    6 : '0110',
    7 : '0111',
    8 : '1000',
    9 : '1001',
    A : '1010',
    B : '1011',
    C : '1100',
    D : '1101',
    E : '1110',
    F : '1111'
}

let binaryToHex = Object.fromEntries(Object.entries(hexToBinary).map(([k,v])=>[v,k]));
let binArr = input.split('').map((x)=>hexToBinary[x]).join('').split('');

const getPath = (object, path) => {
    if(!path.toString().includes('.')){
        return object[path]
    } else {
        return path
        .split('.')
        .reduce((o,p)=>o&&o[p]||null, object)
    }
}

const setPath = (object, path, value) => {
    if(!path.toString().includes('.')){
        object[path] = value
    } else {
        path.split('.').reduce((o,p,i) => o[p] = path.split('.').length === ++i ? value : o[p] || {}, object)
    }
}

// Part 1
let packet = {};
let versionCount = 0;

function outerPacket(toBinaryArr,packetKey){
    let version = binaryToHex[`0${toBinaryArr.splice(0,3).join('')}`]
    let typeID = binaryToHex[`0${toBinaryArr.splice(0,3).join('')}`]
    let type = typeID === '4' ? 'Literal value' : 'Operator'
    let lengthTypeID

    versionCount+=parseInt(version)

    setPath(packet,packetKey,{})
    setPath(packet,`${packetKey}.version`,parseInt(version))
    setPath(packet,`${packetKey}.typeID`,parseInt(typeID))
    setPath(packet,`${packetKey}.type`,type)

    if (type === 'Operator'){
        lengthTypeID = toBinaryArr.shift()
        setPath(packet,`${packetKey}.lengthTypeID`,parseInt(lengthTypeID))
        setPath(packet,`${packetKey}.subpackets`,{})
        
        if(lengthTypeID === '0'){
            let subPacketCounter = 0
            let subPacketLength = parseInt(toBinaryArr.splice(0,15).join(''),2)
            setPath(packet,`${packetKey}.subPacketLength`,subPacketLength)
            let stopLen = toBinaryArr.length - subPacketLength

            while(toBinaryArr.length>stopLen){
                let subPacketKey = `${packetKey}.subpackets.${subPacketCounter}`
                outerPacket(toBinaryArr,subPacketKey)
                subPacketCounter++
            }
        }

        if(lengthTypeID === '1'){
            let subPacketCount = parseInt(toBinaryArr.splice(0,11).join(''),2)
            setPath(packet,`${packetKey}.subPacketCount`,subPacketCount)
            let subPacketCounter = 0

            while(subPacketCount>0){
                let subPacketKey = `${packetKey}.subpackets.${subPacketCounter}`
                outerPacket(toBinaryArr,subPacketKey)
                subPacketCounter++
                subPacketCount--
            }
        }
    } else {
        // Find groups
        let groupArr = []
        let sliceStart = 0
        let sliceEnd = 5
        let endfound = false

        while(toBinaryArr.length>=5 && !endfound){
            groupArr.push(toBinaryArr.splice(sliceStart,sliceEnd).join(''))
            if (groupArr.at(-1).charAt(0)==='0'){
                endfound = true
            }
        }
        setPath(packet,`${packetKey}.groups`,groupArr)
        setPath(packet,`${packetKey}.value`,parseInt(groupArr.map((x)=>x.slice(1)).join(''),2))
    }
    return versionCount
}

console.log('Part 1 answer is ',outerPacket(binArr,'0')) // Part 1 answer

// Part 2
let currParent = '0'

while(packet[0]['value']===undefined){
    let newParent

    while(!Object.entries(getPath(packet,`${currParent}.subpackets`)).every(([k,v])=> v.value !== undefined)){
        let noVals = Object.entries(getPath(packet,`${currParent}.subpackets`)).filter(([k,v])=> v.value === undefined)
        newParent=`${currParent}.subpackets.${noVals[0][0]}`
        currParent = newParent
    }

    let thisObj = getPath(packet,currParent)
    let currTypeID = thisObj.typeID
    let values = Object.entries(thisObj['subpackets']).map(([k,v])=>v.value)

    if(currTypeID === 0){
        setPath(packet,`${currParent}.value`,values.reduce((acc,curr)=>acc+curr,0))
    } else if (currTypeID === 1){
        setPath(packet,`${currParent}.value`,values.reduce((acc,curr)=>acc*curr,1))
    } else if (currTypeID === 2){
        setPath(packet,`${currParent}.value`,Math.min(...values))
    } else if (currTypeID === 3){
        setPath(packet,`${currParent}.value`,Math.max(...values))
    } else if (currTypeID === 5){
        if(values[0]>values[1]){
            setPath(packet,`${currParent}.value`,1)
        } else {
            setPath(packet,`${currParent}.value`,0)
        }
    } else if (currTypeID === 6){
        if(values[0]<values[1]){
            setPath(packet,`${currParent}.value`,1)
        } else {
            setPath(packet,`${currParent}.value`,0)
        }
    } else if (currTypeID === 7){
        if(values[0]===values[1]){
            setPath(packet,`${currParent}.value`,1)
        } else {
            setPath(packet,`${currParent}.value`,0)
        }
    }

    newParent = currParent.split('.').length>3 ?currParent.split('.').slice(0,-2).join('.') : currParent.split('.').at(0)
    currParent = newParent
}

console.log('Part 2 answer is ',packet['0'].value) // Part 2 answer


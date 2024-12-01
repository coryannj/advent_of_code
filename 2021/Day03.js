const fs = require('fs');
const input = fs.readFileSync('../day3input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=> x.split(''))

let gamma = ''
let epsilon = ''

let numLen = lines[0].length

for(i=0;i<numLen;i++){
    let position = lines.map((x)=>x[i])
    let zeroCount = position.filter((x)=> x === '0').length
    let oneCount = position.filter((x)=> x === '1').length

    if(zeroCount>oneCount){
        gamma+='0'
        epsilon+='1'
    }else{
        gamma+='1'
        epsilon+='0'
    }
}
console.log(gamma,epsilon,(parseInt(gamma,2)*parseInt(epsilon,2))) // Part 1

let oxygen = ''
let CO2 = ''

let oxygenQueue = lines.slice()
let CO2Queue = lines.slice()

for(j=0;j<numLen;j++){
    if(oxygenQueue.length>1){
        let oxyPosition = oxygenQueue.map((x)=>x[j])
        let oxyZeroCount = oxyPosition.filter((x)=> x === '0').length
        let oxyOneCount = oxyPosition.filter((x)=> x === '1').length
        let newOxy

        if(oxyZeroCount === oxyOneCount){
            newOxy = oxygenQueue.filter((x)=> x.at(j)==='1')

            
        } else if(oxyZeroCount>oxyOneCount){
            newOxy = oxygenQueue.filter((x)=> x.at(j)==='0')

        } else {
            newOxy = oxygenQueue.filter((x)=> x.at(j)==='1')

        }
        oxygenQueue = newOxy
        //console.log('newOxy',newOxy.map((x)=>x.join('')))
    }

    if(CO2Queue.length>1){
        let CO2Position = CO2Queue.map((x)=>x[j])
        let CO2ZeroCount = CO2Position.filter((x)=> x === '0').length
        let CO2OneCount = CO2Position.filter((x)=> x === '1').length
        let newCO2
    
        if(CO2ZeroCount === CO2OneCount){

            newCO2 = CO2Queue.filter((x)=> x[j]==='0')
            
        } else if(CO2ZeroCount>CO2OneCount){

            newCO2 = CO2Queue.filter((x)=> x[j]==='1')
        } else {

            newCO2 = CO2Queue.filter((x)=> x[j]==='0')
        }
        CO2Queue = newCO2
        //console.log('newCO2',newCO2.map((x)=>x.join('')))
    }
}

let oxy = oxygenQueue.at(-1).join('')
let co = CO2Queue.at(-1).join('')

console.log(parseInt(oxy,2)*parseInt(co,2))
const fs = require('fs');
const input = fs.readFileSync('../day20input.txt',{ encoding: 'utf8', flag: 'r' });

// Part 1 and 2

let keys = input.match(/([%&]\w+)/g)

const lines = input.split(/[\r\n]+/).map((x)=> {
  return x.match(/([\w&%]+)/g).map((y)=>{{return (!!keys.find((z)=> z.slice(1) === y)) ? keys.find((z)=> z.slice(1) === y) : y}})
})

let nextMap = {}
let rxMap = {} // for Part 2

// Populate objects
lines.forEach((el)=> {
  nextMap[el[0]] = {}
  nextMap[el[0]]['next'] = el.slice(1)
  
  // Create input array for all '&' conjunction modules and set initial value to 'low'
  if(el[0].charAt(0) === '&') {
    let inputKeys = lines.filter((x)=> x.includes(el[0]) && x[0] !== el[0]).map((y)=> y[0])
    let inputObj = {}
    inputKeys.forEach((key)=> {
      inputObj[key] = 'low'

      if(el.slice(1).includes('rx')) {
        rxMap[key] = []
      }

    });

    nextMap[el[0]]['inputs'] = inputObj
    nextMap[el[0]]['send'] = 'high'
  }

  if (el[0].charAt(0) === '%') {
    nextMap[el[0]]['toggle'] = 'off'
    nextMap[el[0]]['send'] = 'low'
  }

  if (el[0] === 'broadcaster') {
    nextMap[el[0]]['send'] = 'low'
  }

})

let pulseLow = 0
let pulseHigh = 0
let buttonPushes = 0
let queue
let stepPulse

while (buttonPushes < 4000) {
  pulseLow++ // For the button -> broadcaster push
  queue = [...nextMap['broadcaster']['next']].map((x)=> ['broadcaster','low',x])
  buttonPushes++

  while(queue.length>0) {
    stepPulse = [source,pulse,destination] = queue.shift()
    //history.push(stepPulse.join('-'))
    pulse === 'low' ? pulseLow++ : pulseHigh++
    if (!!nextMap[destination]){      
      if (destination.charAt(0) === '%' && pulse === 'low') {
        nextMap[destination]['toggle'] === 'off' ? nextMap[destination]['toggle'] = 'on' : nextMap[destination]['toggle'] = 'off'
        nextMap[destination]['send'] === 'low' ? nextMap[destination]['send'] = 'high' : nextMap[destination]['send'] = 'low'
    
        let nextArr = nextMap[destination]['next']
        nextArr.forEach((key)=> queue.push([destination,nextMap[destination]['send'],key]))

      } else if (destination.charAt(0) === '&' && (pulse === 'low' || pulse === 'high')) {

        if (nextMap[destination]['inputs'][source] !== pulse) {
          //console.log('in conjunction if block - received doesnt match last')

          if (pulse === 'high') {
            
            nextMap[destination]['inputs'][source] = 'high'
            
            if(destination === '&zh') {
              rxMap[source].push(buttonPushes) // For Part 2 - log first high pulse from all inputs
            }
            
          } else {
            nextMap[destination]['inputs'][source] = 'low'
          }

          let inputCheck = [...Object.values(nextMap[destination]['inputs'])]
    
          if (inputCheck.every((x)=> x === 'high')) {
            nextMap[destination]['send'] = 'low'
          } else {
            nextMap[destination]['send'] = 'high'
          }
        
        }

        let nextArr = nextMap[destination]['next']
        nextArr.forEach((key)=> queue.push([destination,nextMap[destination]['send'],key]))

      } else {
        //console.log('do nothing not % with low or &')
      }

    } 
  }

  if (buttonPushes === 1000) {
    console.log('buttonpushes is ',buttonPushes)
    console.log('pulselow,pulsehigh is ',pulseLow,pulseHigh)
    console.log('Part 1 answer is ',pulseLow*pulseHigh)
  }

}

console.log(rxMap) // First occurrence of high - multiply for LCD
console.log('Part 2 answer is',[...Object.values(rxMap)].reduce((acc,curr)=> acc*curr,1))

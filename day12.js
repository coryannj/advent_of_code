const fs = require('fs');
const { get } = require('https');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=> {let [a,b]=x.split(' '); return [a,b.split(',').map((n)=>parseInt(n))]})

function getArrangements (spr,br,p1orp2) {

  let springsSplit
  let brokenMap
  if (p1orp2 === 'p1') {
    springsSplit = spr.split('')
    brokenMap = br.map((x)=> '#'.repeat(x)).join('.').split('')
  } else {
    let unfolded = Array(5).fill(spr).join('?').replaceAll(/[.]+/g,'.').replaceAll(/^[.]+/gm,'').replaceAll(/[.]+\s/gm,' ')

    unfolded = unfolded.replaceAll(/[.]+/g,'.').replaceAll(/^[.]+/gm,'').replaceAll(/[.]+\s/gm,' ')

    springsSplit = unfolded.split('')
    brokenMap = Array(5).fill(br.join(',')).flatMap((x)=> x.split(',').map((y)=> parseInt(y))).map((z)=> '#'.repeat(z)).join('.').split('')
  }

  let wriggle = springsSplit.length-brokenMap.length

  let states = ['.'].concat(brokenMap,'.')
  let statesCount = []
  let consumedIndex = []
  
  // console.log(' *** FUNCTION ***')
  // console.log('spr,br ',spr,br)
  // console.log('springsSplit is ',springsSplit)
  // console.log('brokenMap is ',brokenMap)
  // console.log('wriggle',wriggle)
  // console.log(' STATES ')
  // console.log(states)
  // console.log(' ')

  springsSplit.forEach((spring,spridx) =>{
    // console.log('spring is ',spring)
    // console.log('spridx is ',spridx)
    let consumedSet =false
    if (spridx === 0) {

      if (spring === '#') {
        statesCount.push({1:1})
        consumedIndex.push(1)
      } else if (spring === '.') {
        statesCount.push({0:1})
      } else {
        statesCount.push({0:1,1:1})
      }

    } else if (spridx > 0 && spridx < springsSplit.length) {
      let nextObj={}
      for([idx,val]of Object.entries(statesCount[spridx-1])){
          //console.log('idx,val is ',idx,val)
        //let statemin = (springsSplit.length-1) - (brokemin-idx)

        let idxNum = parseInt(idx)
        let lastState = states[idxNum]
        let nextState = states[idxNum+1]
        let wriggleIndex = idxNum+wriggle
        let nextVal = val
        // console.log('last state ',lastState)
        // console.log('next state ',nextState)
        // console.log('wriggleIndex is ',wriggleIndex)
        let nextStateVal

        if (statesCount[spridx-1][idxNum+1] === undefined) {
          nextStateVal=0
        } else {
          nextStateVal=statesCount[spridx-1][idxNum+1]
        }


        //idxNum === 0 ? nextVal = 1 : nextVal = val
        if (spridx<=wriggleIndex && (consumedIndex.length === 0||idxNum>=(consumedIndex.at(-1)))) {
          //console.log('first if block - spridx<wriggleindex or consumedindex check')
  
          if (idxNum < states.length-2) {
            if (nextState === '#' && spring !== '.') {
              if(idxNum === states.length-3) {
                if (!spr.substring(spridx+1).includes('#')) {
                  nextObj[idxNum+1] = nextVal
                }
              } else {
                nextObj[idxNum+1] = nextVal
              }
            
            }
            
            if (nextState === '.' && spring !== '#') {
              nextObj[idxNum+1] = nextVal+nextStateVal
            }
  
            if (lastState === '.' && spring !== '#' && statesCount[spridx-1][idxNum-1] === undefined) {
              nextObj[idxNum] = nextVal
            }
          }


        }
        if (idxNum === states.length-2) {
           //console.log('in first end state block last #')
           //console.log(!springsSplit.join('').substring(spridx+1).includes('#') && spring !== '#')
          if(!springsSplit.join('').substring(spridx+1).includes('#') && spring !== '#') {
            nextObj[idxNum+1] = nextVal+nextStateVal
          }

        }

        if (idxNum === states.length-1 && statesCount[spridx-1][idxNum-1] === undefined) {
          nextObj[idxNum] = val
        }

        if (spring === '#' && consumedSet===false) {
          let earliestSpring = Object.keys(nextObj).find((x)=> states[parseInt(x)] === '#')
          //console.log('earliest Spring is - states are # ',earliestSpring)
          
          if(earliestSpring !== undefined){
            if (states[(parseInt(earliestSpring)-1)] === '.') {
              consumedIndex.push(parseInt(earliestSpring))
              consumedSet=true
              //console.log('*** if block = consumed index updated ***')
            }

            //earliestSpring = earliestSpring.find((y)=> states[(parseInt(y)-1)] === '.')
            //  console.log('find correct earliest spring ',earliestSpring)
            // if (earliestSpring !== undefined) {
            //   consumedIndex.push(parseInt(earliestSpring))
            //   consumedSet=true
            //    console.log('*** consumed index updated ***')
            //    //console.log(consumedIndex)
            // }

          }




        }

        

        //console.log(idx,val)
      }
      if (spridx<wriggle && spring !== '#' && consumedIndex.length === 0) {
        nextObj[0] = 1
    }
       
      statesCount.push(nextObj)
      // console.log('nextObj is ',nextObj)
      // console.log('statesCount is')
      // console.log(statesCount)
      // console.log('consumed index is')
      // console.log(consumedIndex)
      // console.log('*** END ***')
    } else {

    }
  })

  let lastObj = statesCount.at(-1)
  
  let secondLastState = lastObj[states.length-2] === undefined ? 0 : lastObj[states.length-2]
  let lastState = lastObj[states.length-1] === undefined ? 0 : lastObj[states.length-1]



  // console.log('secondLastState',secondLastState)
  // console.log('Last state', lastState)

  return secondLastState+lastState
}
let p1sum = 0
let p2sum = 0

lines.forEach(([springs,broken])=> {
  //console.log(springs,' ',broken)
  let p1arrangements = getArrangements(springs,broken,'p1')
  let p2arrangements = getArrangements(springs,broken,'p2')
  p1sum += p1arrangements
  p2sum += p2arrangements
  //console.log('arrangements ',arrangements, ' and sum is now ',sum)
})
console.log(p1sum)
console.log(p2sum)



const fs = require('fs');
const { get } = require('https');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=> {let [a,b]=x.split(' '); return [a,b.split(',').map((n)=>parseInt(n))]})



let firstlastcharregex = /(^#)|(#$)/m


// let lines = linesoriginal.filter(([spring,broken])=>{
//   let springSpl = spring.split('.').filter((e)=>e.includes('#'))
//   let oneCheck = springSpl.length === broken.length
//   && (springSpl.every((y,yidx)=> !!firstlastcharregex.test(y) || y.length === broken[yidx] || broken[yidx] === 1))
//   return !oneCheck
// })

// sum+=(linesoriginal.length-lines.length)

// console.log('sum is ',sum)

function getArrangements (spr,br,p1orp2) {

  let springsSplit
  let brokenMap
  if (p1orp2 === 'p1') {
    springsSplit = spr.split('')
    brokenMap = br.map((x)=> '#'.repeat(x)).join('.').split('')
  } else {
    let unfolded = Array(5).fill(spr).join('?').replaceAll(/[.]+/g,'.').replaceAll(/^[.]+/gm,'').replaceAll(/[.]+\s/gm,' ')
    //console.log('unfolded',unfolded)

    unfolded = unfolded.replaceAll(/[.]+/g,'.').replaceAll(/^[.]+/gm,'').replaceAll(/[.]+\s/gm,' ')
    //console.log('unfolded replaceALL ',unfolded)
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

  //console.log(statesCount)

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


















lines.forEach(([springs,broken])=> {
  console.log(springs,' ',broken)
  let brokenLen = broken.length
  let springsLen = springs.length
  let firstBroken = broken[0]
  let lastBroken = broken.slice(-1)
  let forCache = []
  let arrangements

  forCache.push([springs,broken].join('_'))

// trim last char (?<=[#][#?]{2})([?]$)
// trim first char (^[?])(?=[#?]{2}[#])
  // console.log(' ')
   //console.log('*** NEW LINE ***')
   //console.log('springs ',springs,' ',broken)
  let trimRegex = new RegExp(`(^[?])(?=[#?]{${firstBroken-1}}[#])|(?<=[#][#?]{${lastBroken-1}})([?]$)`,'gm')

  // let removeFirstRegex = new RegExp(`(?<=^)([#][#?]{${firstBroken-1}}[.?])|(?=^[?][?#]{${firstBroken-1}}[.])([?]+[#]+[?]*[.])`,'m')

  let removeFirstRegex = new RegExp(`(?<=^)([#][#?]{${firstBroken-1}}[.?])|(?<=^[?#]{${firstBroken-1}})([#][.])|(?=^[?#]+[.])([#]{${firstBroken}}[.])`,'m')

  // let removeLastRegex = new RegExp(`([^#][#?]{${lastBroken-1}}[#]$)|([.]+[?]*[#]+[?]*)(?<=[.][?#]{${lastBroken}}$)`,'m')

  let removeLastRegex = new RegExp(`([^#][#?]{${lastBroken-1}}[#]$)`,'m')

//  do {
//     springs = springs.replaceAll(trimRegex,'')
//     let trimLength = springs.length
//     //console.log('trim is ',springs,' ',broken)
  
//     springs = springs.replace(removeFirstRegex,'')
//     springs.length < trimLength ? broken.shift() : ''
//     let firstLength = springs.length
//     //console.log('removeF ',springs,' ',broken)
  
//     springs = springs.replace(removeLastRegex,'')
//     springs.length < firstLength ? broken.pop() : ''
//     //console.log('removeL ',springs,' ',broken)

//     firstBroken = broken[0]
//     lastBroken = broken.slice(-1)
//     trimRegex = new RegExp(`((?<=^)[.]*)([?]{0,${firstBroken-1>0?firstBroken-1:0}}[.]+)|([.]+[?]{0,${lastBroken-1>0?lastBroken-1:0}})([.]*(?=$))|(^[?])(?=[#?]{${firstBroken-1}}[#])|(?<=[#][#?]{${lastBroken-1}})([?]$)`,'gm')

//     removeFirstRegex = new RegExp(`(?<=^)([#][#?]{${firstBroken-1}}[.?])|(?<=^[?#]{${firstBroken-1}})([#][.])`,'m')


  
//     removeLastRegex = new RegExp(`([^#][#?]{${lastBroken-1}}[#]$)`,'m')
//   } while(!!trimRegex.test(springs) || !!removeFirstRegex.test(springs) || !!removeLastRegex.test(springs))



  if (broken.length === 0) {
    sum++
    //console.log('only one match - no broken left')
  } else {
    let brokenMin = broken.reduce((acc,curr)=> acc+curr)+(broken.length-1)
    //console.log('brokemin is ',brokenMin, 'string length is ',springs.length)
    if (springs.length === brokenMin) {
      sum++
      //console.log('only one match - no wriggle room')
    } else {
      if (broken.length === 1 && springs.length-brokenMin<broken[0]) {
        //console.log('only one broken, ',springs.length-brokenMin+1,' combinations')
      }
      //console.log('*** FUNCTION ***')

      let springSplitCheck = springs.split('.')
      let checkRegex = /(^#|#$)/m

      if (springSplitCheck.length === broken.length && springSplitCheck.every((x)=>checkRegex.test(springs) === true)) {
        console.log('all groups have broken, ',springs,broken)
        sum++
      } else if (broken.length === 1 && broken[0] === 1 && springs.includes('#')) {
        console.log('only 1 broken, ',springs,broken)
        sum++
      } else {
        arrangements = getArrangements(springs,broken)


        sum += arrangements
        //console.log('arrangements ',arrangements, ' and sum is now ',sum)
      }

    }


  }
  console.log('arrangements ',arrangements, ' and sum is now ',sum)
})

console.log(sum)

// Adopted from https://github.com/maneatingape/advent-of-code-rust/blob/main/src/year2023/day12.rs

??????#?
#.##.##.
#.##..##
#..##.##
.#.##.##

let spr = '??????#?'

     
let broke = [ 1, 2, 2 ]

let sprlen = 8
let brmin = 7

let sprArr = spr.split('').concat('.')
let startArr = spr.slice(0,2)
let rest = spr.slice(2,3).split('')
console.log(startArr,rest)
let checkrow = Array(sprArr.length).fill(0)

console.log(sprArr, checkrow)

let checkArr = [sprArr]

console.log(checkArr)

broke.forEach((br)=> {
  let iterations = sprlen-brmin+1
  let startArr = spr.slice(0,2)
  let rest = spr.slice(2,3).split('')
  let thisRow = checkrow.slice(0)
  let groupRegex =  new RegExp(`([#?]{${br}}[?.])`,'m')
  
})

console.log(firstBroken,lastBroken)

const hashregex=/([#]+)/g
const lineSplitRegex=/([^.]+)/g

let teststr = '?###????????'
let regex = /(?=([#?]{3}))(?=[.?]*?)(?=[#?]{2})(?=[.?]*?)(?=[#?]{1})/g
console.log([...teststr.matchAll(regex)])
console.log(teststr.match(regex))

let test2 = '????????'
let reg2 = /(?=([#?]{2}))(?=[.?]*?|[.?]+)(?=([#?]))/g

console.log([...test2.matchAll(reg2)])
console.log(test2.match(reg2))


//Part 1

/* 
 Logic:
  1. Trim dots ('.') from start/end of string and split string on remaining dots into spring 'groups' 
    - Since we can't place hashes in these positions they don't affect the number of options 
    - e.g. .??..??...?##. 1,1,3  is exactly the same as ['??','??,'?##'],[1,1,3]
  2. Loop through below till no more can be found:
    - Early exit conditions
    - Remove first/last spring group or broken value conditions
    - Trim first/last conditions
  3. For remaining - calculate number of options
    For each spring group:
      - Calculate how many combos of brokens are possible
      - Calculate no. of extra chars for each combo - which all have to be dots ('.')
      - Calculate how the extra dots can be distributed
        i. Calculate no. of integer partitions < broken.length + 1 (i.e. extra dots can be before/after/inbetween hashes)
        ii. Calculate no. of unique combinations
      - If spring group has no hashes - save and move onto next group, otherwise validate combinations first
  4. Calculate valid combos and add to total
  5. Memoisation:
    - Full input string/spring groups/trimmed spring groups with option count
    - Integer partitions
    - Integer partitions combinations for given array length

*/

//**** HELPER FUNCTIONS ****

//---Early exit conditions: 1 option only---
const exitConditions = (sprarr,brokearr) => {
  let exitarray = []
  
  // Calculate minimum no. of chars e.g. rejoin with single dot inbetween
  let springsmin = sprarr.join('').length+sprarr.length-1 
  let brokenmin = brokearr.reduce((acc,curr) => acc + curr,0) + brokearr.length-1 
  
  // String group chars = min chars i.e. zero degrees of freedom
  exitarray.push(springsmin===brokenmin) 

  // broken.length === 2 && 1 spring group which starts and ends with '#' e.g. '#?????#' 2,2
  exitarray.push(sprarr.length===1 && brokearr.length===2 && sprarr[0].charAt(0)==='#' && sprarr[0].slice(-1)==='#') 

  // No. spring groups === broken.length && all start/end with hash or all groups have a hash and spring group[i] length is equal to broken[i] length e.g. ['?#','?#?','#?'] 1,3,1
  exitarray.push(sprarr.length === brokearr.length && sprarr.every((x)=> x.includes('#')) && sprarr.every((x,idx)=> x.charAt(0)==='#' || x.slice(-1)==='#' || x.match(hashregex)[0].length === brokearr[idx])) 

  return exitarray // true/false for each condition
}

//---Remove first/last spring group conditions---

//Remove first spring and/or broken
const removeFirstConditions = (sprarr,brokearr) => {
  let removefirstarray = []
  let springsmin = sprarr.join('').length+sprarr.length-1 
  let brokenmin = brokearr.reduce((acc,curr) => acc + curr,0) + brokearr.length-1
  
  // Can't place broken in first spring group, remove spring only e.g. ['?','?????'] 3,1
  removefirstarray.push(sprarr[0].length < brokearr[0]) 

  // Can't place first broken in 2nd spring group && length equals first broken
  removefirstarray.push(sprarr[0].length >= (springsmin-brokenmin) && sprarr[0].length === brokearr[0]) 

  // First/last char is '#' and can't fit second broken
  removefirstarray.push(sprarr[0].length <(brokearr[0]+brokearr[1]+1) && (sprarr[0].charAt(0)==='#' || sprarr[0].slice(-1)==='#'))
  
  return removefirstarray
}

//Remove last spring and/or broken
const removeLastConditions = (sprarr,brokearr) => {
  let removelastarray = []
  let sprlastlen = sprarr[sprarr.length-1].length
  let brokenlast = brokearr[brokearr.length-1]
  let springsmin = sprarr.join('').length+sprarr.length-1 
  let brokenmin = brokearr.reduce((acc,curr) => acc + curr,0) + brokearr.length-1

  removelastarray.push(sprlastlen<brokenlast) // Last string length < last broken - remove spring only
  
  removelastarray.push(sprlastlen >= (springsmin-brokenmin) && sprlastlen === brokenlast) // Can't place last broken in 2nd last group && length equals last broken

  // First/last char is '#' and can't fit 2nd last broken
  removelastarray.push(sprlastlen<(brokenlast+brokearr[brokearr.length-2]+1) && (sprarr[sprarr.length-1].charAt(0)==='#' || sprarr[sprarr.length-1].slice(-1)==='#'))
  
  return removelastarray
}

//---Trim first/last conditions---

//Partial remove first spring and/or broken
const trimFirstConditions = (sprarr,brokearr) => {
  let trimfirst = []

  // Can't place broken spring in first position (there's a hash directly after) - trim spring[0] char(0) only
  trimfirst.push(sprarr[0].charAt(brokearr[0]) === '#')

  // First char is '#' - trim spring and remove first broken
  trimfirst.push(sprarr[0].charAt(0) === '#')

  return trimfirst

}

//Partial remove last spring and/or broken
const trimLastConditions = (sprarr,brokearr) => {
  let trimlast = []
  let springlast = sprarr[sprarr.length-1]
  let springlastlen = springlast.length

  // Hash just before last broken - can't place in last index - trim last spring last char only
  trimlast.push(springlast.charAt(springlastlen - (brokearr[brokearr.length-1]+1)) === '#')

  // Last char is '#' - trim spring and remove last broken
  trimlast.push(springlast.slice(-1) === '#')

  return trimlast
}

// ---Combine all conditions into single object---
const getConditions = (sprarr,brokearr) => {
  let conditionsObject = {}

  conditionsObject['exitConditions'] = exitConditions(sprarr,brokearr)
  conditionsObject['removeFirstConditions'] = removeFirstConditions(sprarr,brokearr)
  conditionsObject['removeLastConditions'] = removeLastConditions(sprarr,brokearr)
  conditionsObject['trimFirstConditions'] = trimFirstConditions(sprarr,brokearr)
  conditionsObject['trimLastConditions'] = trimLastConditions(sprarr,brokearr)

  return conditionsObject
}

//Set current spring group and all prev string groups into memo
const setMemo = (memoarr,numOfOptions) => {

  for (const mkey of memoarr) {
    memo[mkey]=numOfOptions
  }
  
}

// Spring groups are all ???? and only one broken can fit in each group
const setSingle = (sprarr,brokearr,memoarr,returnarray) => {
    let fullkey = `${sprarr.join('.')} ${brokearr.join(',')}`
    memoarr.push(fullkey)
    let subresults = []
    
    if (memo[fullkey] != undefined) {
      console.log(fullkey,' is in memo and value is ',memo[fullkey])
      subresults.push(memo[fullkey])
      console.log('added ',memo[fullkey],' and subresults is now ',subresults)
    } else {
      for (const [index,val] of sprarr.entries()) {
        let subkey= `${val} ${brokearr[index]}`
        let perms = val.length+1 - brokearr[index]
        memo[subkey]=perms
        subresults.push(perms)
        console.log('perms is ',perms,' and subresults is now ',subresults)
      }
    }
    let resultssum = subresults.reduce((acc,curr) => acc * curr,1)

    if (returnarray === 'false') {
      combos+=resultssum
      setMemo(memoarr,resultssum)
    } else {
      return [resultssum]
    }
}


let combos=0
let memo={}
let memoIntegerPartitions={}
let memoCombos={}
let remaining = {}

//**** EXECUTION STARTS HERE ****
for (const line of lines) {
  let memoarray = []
  memoarray.push(line.join(' '))
  let broken = line[1].split(',').map(Number)

  let brokeregexstr = broken.flatMap((x)=> [`([?#]{${x}})`,`([?.]+)`]).slice(0,-1).join('')
  let brokenregex = new RegExp(brokeregexstr,"g")
  const regexdots = /([.]{2,})/g
  // let springs = line[0].match(brokenregex).join('').split('.').filter((x)=> x.length>0) // split on dots since they don't add to combos count

  let springs = line[0].match(brokenregex)[0].replace(regexdots,'.').split('.')
  
  //.map((x)=> x.replace(regexdots,'.')).flatMap((y)=> y.split('.'))

  let conditions = getConditions(springs,broken)
  let springsmin = springs.join('').length+springs.length-1 
  let brokenmin = broken.reduce((acc,curr) => acc + curr,0) + broken.length-1 
  let sparechars = springsmin-brokenmin // degrees of freedom
  let whilekey = `${springs.join('.')} ${broken.join(',')}`
  memoarray.push(whilekey)

  console.log('*****************NEWLINE***************')
  console.log(springs)
  console.log(springsmin)
  console.log(broken)
  console.log(brokenmin)
  console.log(sparechars)

  // Process lines as much as possible
  while (
    memo[whilekey] != undefined ||
    conditions['exitConditions'].includes(true) ||
    conditions['removeFirstConditions'].includes(true) ||
    conditions['removeLastConditions'].includes(true) ||
    conditions['trimFirstConditions'].includes(true) ||
    conditions['trimLastConditions'].includes(true)
    )
    {
      if (memo[whilekey] != undefined) {
        
        console.log('in memo')
        let val = memo[whilekey]
        setMemo(memoarray,val)
        combos += val
        break;

      } else if (conditions['exitConditions'].includes(true) || (conditions['removeFirstConditions'].includes(true) && conditions['removeLastConditions'].includes(true) && springs.length === broken.length && springs.length < 3)) {
        
        console.log('***no more chars**')
        setMemo(memoarray,1)
        combos++
        break;

      } else if (conditions['removeFirstConditions'].includes(true) || conditions['removeLastConditions'].includes(true)) {

        if(conditions['removeFirstConditions'].includes(true)) {
          console.log('***remove first spring**')
          springs.shift()
          if (conditions['removeFirstConditions'][0] === false) {
            console.log('***remove first broken**')
            broken.shift()
          }
        }

        if(conditions['removeLastConditions'].includes(true)) {
          console.log('***remove last spring**')
          springs.pop()
          if (conditions['removeLastConditions'][0] === false) {
            console.log('***remove last broken**')
            broken.pop()
          }
        }

    } else if (conditions['trimFirstConditions'].includes(true) || conditions['trimLastConditions'].includes(true)) {
      console.log('****trimfirstlast includes true********')
      if (conditions['trimFirstConditions'].includes(true)) {
        if (conditions['trimFirstConditions'][0] === true) {
          console.log('cant place first char')
          springs[0]= springs[0].substring(1)
        }
        if ((conditions['trimFirstConditions'][0] === true && broken[0] === 1) || conditions['trimFirstConditions'][1] === true){
        console.log('first char is #')  
        springs[0] = springs[0].substring(broken[0]+1)
          broken.shift()
        }
      }

      if (conditions['trimLastConditions'].includes(true)) {
        if (conditions['trimLastConditions'][0] === true) {
          console.log('cant place first char')
          springs[springs.length-1]= springs[springs.length-1].slice(0,-1)  
        } else {
          let endtrim = (broken[broken.length-1]+1)*-1
          springs[springs.length-1] = springs[springs.length-1].slice(0,endtrim)
          broken.pop()
        }

      }


    }

    // Recalculate
    conditions = getConditions(springs,broken)
    springsmin = springs.join('').length+springs.length-1 // if we reintroduce min no. of dots
    brokenmin = broken.reduce((acc,curr) => acc + curr,0) + broken.length-1 // with min no. of dots
    sparechars = springsmin-brokenmin // degrees of freedom
    whilekey = `${springs.join('.')} ${broken.join(',')}`
    memoarray.push(whilekey)
    console.log('******* after truncation**********')
    console.log(springs,broken,sparechars)
     //console.log(springs)
    //console.log(springsmin)
    //console.log(broken)
    //console.log(brokenmin)
    console.log(whilekey)


  }


  // Process remaining
  let onespring = springs.every((x,idx)=> {
    return idx<springs.length-1 ?x.length < (broken[idx]+broken[idx+1]+1) : x.length < (broken[idx]+broken[idx-1]+1)
  })

  // All springs are ???? and only one broken in each spring
  if (springs.every((x)=>!x.includes('#'))&& broken.length === springs.length && ((broken.length===1 && springs.length===1)|| onespring===true)) {
    setSingle(springs,broken,memoarray,'false')

  } else {
    remaining[whilekey] = 0
  }

}
console.log('combos is',combos)
console.log(memo)
console.log('****REMAINING****')
console.log(remaining)





for (const line of lines) {
  let memoarray = []
  let springs = line[0].match(lineSplitRegex)
  let broken = line[1].split(',').map(Number)
  

  
  let springsmin = springs.join('').length+springs.length-1 
  let brokenmin = broken.reduce((acc,curr) => acc + curr,0) + broken.length-1 
  let sparechars = springsmin-brokenmin // degrees of freedom
  console.log('*****************NEWLINE***************')
  console.log(springs)
  console.log(springsmin)
  console.log(broken)
  console.log(brokenmin)

  // Process lines as much as possible
  while ([...exitConditions(springs,broken)].includes(true) || [...removeFirstConditions(springs,broken)].includes(true) || [...removeLastConditions(springs,broken)].includes(true) || [...trimFirstConditions(springs,broken)].includes(true) || [...trimLastConditions(springs,broken)].includes(true)) {
    
    let whilekey = `${springs.join('.')} ${broken.join(',')}`

    let removefirst = [...removeFirstConditions(springs,broken)]
    let removelast = [...removeLastConditions(springs,broken)]
    let trimfirst = [...trimFirstConditions(springs,broken)]
    let trimlast = [...trimLastConditions(springs,broken)]
    
    if ([...exitConditions(springs,broken)].includes(true) ||(removefirst.includes(true) && removelast.includes(true) && springs.length === broken.length && springs.length < 3)) {
      console.log('***no more chars**')
      memo[whilekey] = 1
      memo[line.join(' ')] = 1
      combos++
      break;
    } else if (removefirst.includes(true) || removelast.includes(true)) {

        if(removefirst.includes(true)) {
          console.log('***remove first spring**')
          springs.shift()
          if (removefirst[0] === false) {
            console.log('***remove first broken**')
            broken.shift()
          }
        }

        if(removelast.includes(true)) {
          console.log('***remove last spring**')
          springs.pop()
          if (removelast[0] === false) {
            console.log('***remove last broken**')
            broken.pop()
          }
        }

    } else if (trimfirst.includes(true) || trimlast.includes(true)) {
      console.log('****trimfirstlast includes true********')
      if (trimfirst.includes(true)) {
        if (trimfirst[0] === true) {
          console.log('cant place first char')
          springs[0]= springs[0].substring(1)
        }
        if ((trimfirst[0] === true && broken[0] === 1) || trimfirst[1] === true){
        console.log('first char is #')  
        springs[0] = springs[0].substring(broken[0]+1)
          broken.shift()
        }
      }

      if (trimlast.includes(true)) {
        if (trimlast[0] === true) {
          console.log('cant place first char')
          springs[springs.length-1]= springs[springs.length-1].slice(0,-1)  
        } else {
          let endtrim = (broken[broken.length-1]+1)*-1
          springs[springs.length-1] = springs[springs.length-1].slice(0,endtrim)
          broken.pop()
        }

      }


    }
  
    // Recalculate
    springsmin = springs.join('').length+springs.length-1 // if we reintroduce min no. of dots
    brokenmin = broken.reduce((acc,curr) => acc + curr,0) + broken.length-1 // with min no. of dots
    sparechars = springsmin-brokenmin // degrees of freedom
    whilekey = `${springs.join('.')} ${broken.join(',')}`
    console.log(springs)
    console.log(springsmin)
    console.log(broken)
    console.log(brokenmin)
    console.log(whilekey)
    console.log('******* after truncation**********')
    if (memo[whilekey] != undefined) {
      console.log('in memo')
      let val = memo[whilekey]
      setMemo(memoarray,val)
      combos += val
      break;
    } else {
      memoarray.push(whilekey)
    }
  }

  // Process remaining
  let onespring = springs.every((x,idx)=> {
    return idx<springs.length-1 ?x.length < (broken[idx]+broken[idx+1]+1) : x.length < (broken[idx]+broken[idx-1]+1)
  })

  // All springs are ???? and only one broken in each spring
  if (springs.every((x)=>!x.includes('#'))&& broken.length === springs.length && ((broken.length===1 && springs.length===1)|| onespring===true)) {
    setSingle(springs,broken,memoarray)

  } else {
    remaining[`${springs.join('.')} ${broken.join(',')}`] = 0
  }
  

}


console.log(combos)
console.log('********* MEMO *********')
console.log(memo)
console.log('********* REMAINING *********')
console.log(remaining)

const partition = (n) => {
  var a = [];
  
  for (var i = 1; i <= n-i; i++)
  {
      for (v of partition(n-i)) {
          v.push(i);
          a.push(v.sort());
      }
  }

  a.push([n]);

  return a;
}

function permute(permutation) {
  var length = permutation.length,
      result = [permutation.slice()],
      c = new Array(length).fill(0),
      i = 1, k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}

let springs=['?#??????'] 
let broken = [3,1]
let springsmin = springs.join('').length+springs.length-1 
let brokenmin = broken.reduce((acc,curr) => acc + curr,0) + broken.length-1 
let sparechars = 3

let dotslength = 4
console.log(springsmin,brokenmin,sparechars,dotslength)

let testpartitions = partition(sparechars).map((x)=>{
  if (x.length === dotslength) {
    return x
  } else if (x.length < dotslength) {
    while(x.length < dotslength) {
      x.push(0)
    }
    return x
  } else {
    return []
  }
}).filter((x)=> x.length>0)

console.log(Array.from(new Set([...permute(testpartitions)].map(JSON.stringify)), JSON.parse))


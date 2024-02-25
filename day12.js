const fs = require('fs');
const { get } = require('https');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=> x.split(' '))
const hashregex=/([#]+)/g
const lineSplitRegex=/([^.]+)/g

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
    - Interger partitions combinations for given array length

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
  let springs = line[0].match(lineSplitRegex)
  let broken = line[1].split(',').map(Number)
  let conditions = getConditions(springs,broken)
  let springsmin = springs.join('').length+springs.length-1 
  let brokenmin = broken.reduce((acc,curr) => acc + curr,0) + broken.length-1 
  //let sparechars = springsmin-brokenmin // degrees of freedom
  let whilekey = `${springs.join('.')} ${broken.join(',')}`
  memoarray.push(whilekey)

  console.log('*****************NEWLINE***************')
  console.log(springs)
  console.log(springsmin)
  console.log(broken)
  console.log(brokenmin)

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
    //sparechars = springsmin-brokenmin // degrees of freedom
    whilekey = `${springs.join('.')} ${broken.join(',')}`
    memoarray.push(whilekey)
    console.log('******* after truncation**********')
    console.log(springs)
    console.log(springsmin)
    console.log(broken)
    console.log(brokenmin)
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




  // let regex = ''
  // // Generate regex string to trim dots from start/end
  // for (i=0;i<broken.length;i++) {
  //   i<broken.length-1 ? regex+=`([?#]{${broken[i]}})([?.])+` : regex+= `([?#]{${broken[i]}})`
  // }
  // let brokenregex = new RegExp(regex,"g")
  // let springs = line[0].match(brokenregex).join('').split('.').filter((x)=> x.length>0) // split on dots since they don't add to combos count
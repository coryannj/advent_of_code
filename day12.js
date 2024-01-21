const fs = require('fs');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=> x.split(' '))

//Part 1
//Note - trying to use logic/maths over brute force :-)

const hashregex=/([#]+)/g

//**** Helper functions ****

//Early exit conditions

//Exit conditions with 1 option
const exitConditions = (sprarr1,brokearr1) => {
  // Calculate minimum no. of chars possible
  let springsmin = sprarr1.join('').length+sprarr1.length-1 
  let brokenmin = brokearr1.reduce((acc,curr) => acc + curr,0) + brokearr1.length-1 
  
  let exitarray = []    
  
  exitarray.push(springsmin===brokenmin) // Zero degrees of freedom

  exitarray.push(sprarr1.length===1 && brokearr1.length===2 && sprarr1[0].charAt(0)==='#' && sprarr1[0].slice(-1)==='#') // 2 broken && 1 spring starts and ends with '#'

  exitarray.push(sprarr1.length === brokearr1.length && sprarr1.every((x)=> x.includes('#')) && sprarr1.every((x,idx)=> x.charAt(0)==='#' || x.slice(-1)==='#' || x.match(hashregex)[0].length === brokearr1[idx])) // No. springs === no. broken && all start/end with hash or hashes equal to broken[i] length

  return exitarray
}



//Remove first/last conditions

//Remove first spring and/or broken
const removeFirstConditions = (sprarr2,brokearr2) => {
  let removefirstarray = []
  let springsmin = sprarr2.join('').length+sprarr2.length-1 
  let brokenmin = brokearr2.reduce((acc,curr) => acc + curr,0) + brokearr2.length-1
  
  removefirstarray.push(sprarr2[0].length < brokearr2[0]) // Can't place broken in first, remove spring only

  removefirstarray.push(sprarr2[0].length >= (springsmin-brokenmin) && sprarr2[0].length === brokearr2[0]) // Can't place first broken in 2nd group && length equals first broken

  // First/last char is '#' and can't fit next broken
  removefirstarray.push(sprarr2[0].length <(brokearr2[0]+brokearr2[1]+1) && (sprarr2[0].charAt(0)==='#' || sprarr2[0].slice(-1)==='#'))
  
  return removefirstarray
}

//Remove last spring and/or broken
const removeLastConditions = (sprarr3,brokearr3) => {
  let removelastarray = []
  let sprlastlen = sprarr3[sprarr3.length-1].length
  let brokenlast = brokearr3[brokearr3.length-1]
  let springsmin = sprarr3.join('').length+sprarr3.length-1 
  let brokenmin = brokearr3.reduce((acc,curr) => acc + curr,0) + brokearr3.length-1

  removelastarray.push(sprlastlen<brokenlast) // Last string length < last broken - remove spring only
  
  removelastarray.push(sprlastlen >= (springsmin-brokenmin) && sprlastlen === brokenlast) // Can't place last broken in 2nd last group && length equals last broken

  // First/last char is '#' and can't fit 2nd last broken
  removelastarray.push(sprlastlen<(brokenlast+brokearr3[brokearr3.length-2]+1) && (sprarr3[sprarr3.length-1].charAt(0)==='#' || sprarr3[sprarr3.length-1].slice(-1)==='#'))
  
  return removelastarray
}

//Trim first/last conditions

//Partial remove first spring and/or broken
const trimFirstConditions = (sprarr4,brokearr4) => {
  let trimfirst = []

  // Hash just after first broken - can't place in index 0 - trim spring char(0) only
  trimfirst.push(sprarr4[0].charAt(brokearr4[0]) === '#')

  // First char is '#' - trim spring and remove first broken
  trimfirst.push(sprarr4[0].charAt(0) === '#')

  return trimfirst

}

//Partial remove first spring and/or broken
const trimLastConditions = (sprarr5,brokearr5) => {
  let trimlast = []
  let springlast = sprarr5[sprarr5.length-1]
  let springlastlen = springlast.length

  // Hash just before last broken - can't place in last index - trim last spring last char only
  trimlast.push(springlast.charAt(springlastlen - (brokearr5[brokearr5.length-1]+1)) === '#')

  // Last char is '#' - trim spring and remove last broken
  trimlast.push(springlast.slice(-1) === '#')

  return trimlast
}

//Set all prev string iterations into memo
const setMemo = (currkey,marray,nums) => {
  if (marray.length > 0) {
    for (const mkey of marray) {
      memo[mkey]=nums
    }
  }
  memo[currkey]=nums
}

// Springs are all ????, one broken per spring
const setSingle = (sprarray,brokearray,memarray) => {
    let fullkey = `${sprarray.join('.')} ${brokearray.join(',')}`
    let subresults = []
    
    if (memo[fullkey] != undefined) {
      console.log(memo[fullkey],' is in memo')
      subresults.push(memo[fullkey])
      console.log(`added ${memo[fullkey]} and subresults is now ${subresults}`)
    } else {
      for (const [index,val] of sprarray.entries()) {
        let subkey= `${val} ${brokearray[index]}`
        let perms = val.length+1 - brokearray[index]
        memo[subkey]=perms
        subresults.push(perms)
        console.log('perms is ',perms,' and subresults is now ',subresults)
      }
    }
    let resultssum = subresults.reduce((acc,curr) => acc * curr,1)
    setMemo(fullkey,memarray,resultssum)
    combos+=resultssum
}


let combos=0
let memo={}
let remaining = {}

// **** Iterating through lines ****
for (const line of lines) {
  let memoarray = []
  let broken = line[1].split(',').map(Number)
  let regex = ''

  // Generate regex string to trim dots from start/end
  for (i=0;i<broken.length;i++) {
    i<broken.length-1 ? regex+=`([?#]{${broken[i]}})([?.])+` : regex+= `([?#]{${broken[i]}})`
  }
  let brokenregex = new RegExp(regex,"g")
  let springs = line[0].match(brokenregex).join('').split('.').filter((x)=> x.length>0) // split on dots since they don't add to combos count
  
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
      setMemo(whilekey,memoarray,val)
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
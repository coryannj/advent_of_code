const fs = require('fs');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=> x.split(' '))

//Part 1

const hashregex=/([#]+)/g

//**** Helper functions ****

//Early exit conditions

//Exit conditions with 1 option
const exitConditions = (springsarray,brokenarray) => {
  // Calculate minimum no. of chars possible
  let springsmin = springsarray.join('').length+springsarray.length-1 
  let brokenmin = brokenarray.reduce((acc,curr) => acc + curr,0) + brokenarray.length-1 
  
  let exitarray = []    
  
  exitarray.push(springsmin===brokenmin) // Zero degrees of freedom

  exitarray.push(springsarray.length===1 && brokenarray.length===2 && springsarray[0].charAt(0)==='#' && springsarray[0].slice(-1)==='#') // 2 broken && 1 spring starts and ends with '#'

  exitarray.push(springsarray.length === brokenarray.length && springsarray.every((x)=> x.includes('#')) && (springsarray.length === 1 || springsarray.filter((x,idx)=> x.charAt(0)!='#' && x.slice(-1)!='#' && x.match(hashregex)[0].length != brokenarray[idx]).length === 0)) // No. springs === no. broken && all start/end with hash or hashes equal to broken[i] length

  return exitarray
}

//Remove first/last conditions

//Remove first spring and/or broken
const removeFirstConditions = (springsarray,brokenarray) => {
  let removefirstarray = []
  let sprfirstlen = springsarray[0].length
  let brokenfirst = brokenarray[0]
  let springsmin = springsarray.join('').length+springsarray.length-1 
  let brokenmin = brokenarray.reduce((acc,curr) => acc + curr,0) + brokenarray.length-1
  let sparechars = springsmin-brokenmin
  
  removefirstarray.push(sprfirstlen<brokenfirst) // Can't place broken in first, remove spring only

  // First spring length > sparechars and length equals first broken
  removefirstarray.push(sprfirstlen >= sparechars && sprfirstlen === brokenfirst)

  // First/last char is '#' and can't fit next broken
  removefirstarray.push(sprfirstlen<(brokenfirst+brokenarray[1]+1) && (springsarray[0].charAt(0)==='#' || springsarray[0].slice(-1)==='#'))
  
  return removefirstarray
}



let combos=0
let memo={}
let remaining = {}
for (const line of lines) {
  let broken = line[1].split(',').map(Number)
  let regex = ''
  for (i=0;i<broken.length;i++) {
    i<broken.length-1 ? regex+=`([?#]{${broken[i]}})([?.])+` : regex+= `([?#]{${broken[i]}})`
  }
  let brokenregex = new RegExp(regex,"g")
  let springs = line[0].match(brokenregex).join('').split('.').filter((x)=> x.length>0) // split on dots since they don't add to combos count
  
  
  let springsmin = springs.join('').length+springs.length-1 // if we reintroduce min no. of dots
  let brokenmin = broken.reduce((acc,curr) => acc + curr,0) + broken.length-1 // with min no. of dots
  let sparechars = springsmin-brokenmin // degrees of freedom
  console.log('*****************NEWLINE***************')
  console.log(springs)
  console.log(springsmin)
  console.log(broken)
  console.log(brokenmin)




  
  //Remove last spring and/or broken
  const removeLastConditions = () => {
    let removelastarray = []
    let sprlastlen = springs[springs.length-1].length
    let brokenlast = broken[broken.length-1]

    // Last string length < last broken - remove spring only
    removelastarray.push(sprlastlen<brokenlast)
    
    // Last string length > sparechars and length equals last broken or last char is '#' and can't fit next broken
    removelastarray.push(sprlastlen >= sparechars && sprlastlen === brokenlast)

    // First/last char is '#' and can't fit next broken
    removelastarray.push(sprlastlen<(brokenlast+broken[broken.length-2]+1) && (springs[springs.length-1].charAt(0)==='#' || springs[springs.length-1].slice(-1)==='#'))
    
    return removelastarray
  }

  //Partial remove first spring and/or broken
  const trimFirstConditions = () => {
    let trimfirst = []

    // Hash just after first broken - can't place in index 0 - trim spring char(0) only
    trimfirst.push(springs[0].charAt(broken[0]) === '#')

    // First char is '#' - trim spring and remove first broken
    trimfirst.push(springs[0].charAt(0) === '#')

    return trimfirst

  }

  //Partial remove first spring and/or broken
  const trimLastConditions = () => {
    let trimlast = []
    let springlast = springs[springs.length-1]
    let springlastlen = springlast.length

    // Hash just before last broken - can't place in last index - trim last spring last char only
    trimlast.push(springlast.charAt(springlastlen - (broken[broken.length-1]+1)) === '#')

    // Last char is '#' - trim spring and remove last broken
    trimlast.push(springlast.slice(-1) === '#')

    return trimlast

  }

  let exit= [...exitConditions()]
  let removefirst = [...removeFirstConditions()]
  let removelast = [...removeLastConditions()]
  let trimfirst = [...trimFirstConditions()]
  let trimlast = [...trimLastConditions()]

  console.log('******* Conditions *********')
  console.log(exit)
  console.log(removefirst)
  console.log(removelast)
  console.log(trimfirst)
  console.log(trimlast)

  while (exit.includes(true) || removefirst.includes(true) || removelast.includes(true)||trimfirst.includes(true)||trimlast.includes(true)) {
    let whilekey = `${springs.join('.')} ${broken.join(',')}`
    if (exit.includes(true)) {
      console.log('***no more chars**')
      memo[whilekey] = 1
      memo[line] = 1
      combos++
      break;
    } else if (removefirst.includes(true)||removelast.includes(true)) {

      if (springs.length === 1 && broken.length === 1 || springs.length === 2 && broken.length === 2 && removefirst.includes(true)&&removelast.includes(true)) {
        console.log('***remove first - no more chars**')
        memo[whilekey] = 1
        memo[line] = 1
        combos++
        break;
      } else {
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

      }
    } else if (trimfirst.includes(true)||trimlast.includes(true)) {
      console.log('****trimfirstlast includes true********')
      if (trimfirst.includes(true)) {
        if (trimfirst[0] === true) {
          console.log('cant place first char')
          springs[0]= springs[0].substring(1)
        } else {
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
    console.log('******* after truncation**********')
    console.log(springs)
    console.log(springsmin)
    console.log(broken)
    console.log(brokenmin)
    exit= [...exitConditions()]
    removefirst = [...removeFirstConditions()]
    removelast = [...removeLastConditions()]
    trimfirst = [...trimFirstConditions()]
    trimlast = [...trimLastConditions()]
    console.log(exit)
    console.log(removefirst)
    console.log(removelast)
    console.log(trimfirst)
    console.log(trimlast)
  }

  // Process remaining
  let onespring = springs.every((x,idx)=> {
    return idx<springs.length-1 ?x.length < (broken[idx]+broken[idx+1]+1) : x.length < (broken[idx]+broken[idx-1]+1)
  })

  let fullkey = `${springs.join('.')} ${broken.join(',')}`

  // All springs are ???? and only one broken in each spring
  if (springs.every((x)=>!x.includes('#'))&& broken.length === springs.length && ((broken.length===1 && springs.length===1)|| onespring===true)) {
    let subresults = []
    
    if (memo[fullkey] != undefined) {
      console.log(memo[fullkey],' is in memo')
      subresults.push(memo[fullkey])
      console.log(`added ${memo[fullkey]} and subresults is now ${subresults}`)
    } else {
      for (const [index,val] of springs.entries()) {
        let subkey= `${val} ${broken[index]}`
        let perms = val.length+1 - broken[index]
        memo[subkey]=perms
        subresults.push(perms)
        console.log('perms is ',perms,' and subresults is now ',subresults)
      }
    }
    let resultssum = subresults.reduce((acc,curr) => acc * curr,1)
    memo[fullkey]=resultssum
    memo[line]=resultssum
    combos+=resultssum
    console.log('added ',resultssum,' and combos is now ',combos)
  } else {
    remaining[fullkey] = 0
  }
  

}


console.log(combos)
console.log('********* MEMO *********')
console.log(memo)
console.log('********* REMAINING *********')
console.log(remaining)

??#?
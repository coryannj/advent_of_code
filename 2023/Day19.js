const fs = require('fs');
const input = fs.readFileSync('../day19input.txt',{ encoding: 'utf8', flag: 'r' });

const workflowRegex = /(.*)\s+(?!{x=)/gm
const ratingsRegex = /({x=.*)/gm

let workflows = input.match(workflowRegex).map((x)=> x.replace('\n','').match(/[^{},]+/g))
let workMap = new Map()
workflows.forEach((el)=>{
  let mapKey = el[0]
  let mapVal = el.slice(1)
  workMap.set(mapKey,mapVal)
})

let ratings= input.match(ratingsRegex).map((x)=> x.match(/(\d+)/g).map(Number))

// PART 1

let start = workflows.find(el=> el[0] === 'in')

let curr = [...start]
let result = []

for (i=0;i<ratings.length;i++) {
  let currRating = ratings[i]

  // Keep going through workflows till A or R is reached - after that set workflow back to start for next loop
  do {
    curr.shift()
    for (j=0;j<curr.length;j++) {
      currRule = curr[j]

      if (currRule === 'A' || currRule === 'R') {
        if (currRule === 'A') {
          result.push(eval(currRating.join('+'))) // What's AOC without a little eval abuse hehe
        }
        curr = [...start]
        break;
      } else if (currRule !== 'A' && currRule !== 'R' && !currRule.includes(':')) {
        curr = [...workflows.find(el=> el[0] === currRule)]
        break;
      } else {
        
        let rulematch = currRule.match(/(?<part>[xmas])(?<operator>[<>])(?<limit>\d+)(?:[:])(?<next>[a-zA-Z]+)/).groups
        let ratingString = ['x','m','a','s']
        
        let partMatch = currRating[ratingString.indexOf(rulematch.part)]

        let ruleMet = rulematch.operator === '<' ? partMatch<parseInt(rulematch.limit) : partMatch>parseInt(rulematch.limit)

        if (ruleMet === true) {
          if (rulematch.next === 'A' || rulematch.next === 'R') {
            if (rulematch.next === 'A') {
              result.push(eval(currRating.join('+')))
            }
            curr = [...start]
          } else {
            curr = [...workflows.find((f)=> f[0] === rulematch.next)]
          }
          break;
        }
      }
    }
  } while (curr[0] !== 'in')

}

console.log('Part 1 answer ',result.reduce((acc,curr)=> acc+curr,0)) // Part 1 answer

// PART 2

let startRange = ['in',[1,4000],[1,4000],[1,4000],[1,4000]]

let processRanges = [[...startRange]] // queue
let acceptedRanges = []
let rejectedRanges = []

while(processRanges.length>0) {
    let currRange = processRanges.shift()
    let lookup = ['key','x','m','a','s']

    nextFlow = [...workMap.get(currRange[0])] // Gets next workflow

    // Loop through each of workflow rules from left to right
    nextFlow.forEach((flow)=> {
      if(flow.includes(':')) {
        let rulematch = flow.match(/(?<part>[xmas])(?<operator>[<>])(?<limit>\d+)(?:[:])(?<next>[a-zA-Z]+)/).groups
        let partIndex = lookup.indexOf(rulematch.part);
        let rulelimit = parseInt(rulematch.limit)

        // For each rule if limit is in the range - update shallow copy to matching and send to queue/accepted/rejected
        // Then update curr range to not match and pass to next rule/queue/accepted/rejected 
        if (currRange[partIndex][0]<= rulelimit && currRange[partIndex][1] >= rulelimit) {
          
          let currRangeTrue = JSON.parse(JSON.stringify(currRange)); // shallow copy of current range
          
          if (rulematch.operator === '<') {
            currRangeTrue[partIndex][1] = rulelimit-1
            currRangeTrue[0] = rulematch.next
            currRange[partIndex][0] = rulelimit
          } else {
            currRangeTrue[partIndex][0] = rulelimit+1
            currRangeTrue[0] = rulematch.next
            currRange[partIndex][1] = rulelimit
          } 

          if (rulematch.next === 'A') {
            acceptedRanges.push(currRangeTrue)
          } else if (rulematch.next === 'R') {
            rejectedRanges.push(currRangeTrue)
          } else {
            processRanges.push(currRangeTrue)
          }

        }
        
      } else if (flow === 'R') {
        rejectedRanges.push(currRange)
      } else if (flow === 'A') {
        acceptedRanges.push(currRange)
      } else {
        currRange[0] = flow
        processRanges.push(currRange)
      }

    })

  }

  console.log('rejected ranges ',rejectedRanges.flatMap((el)=>{el.shift(); return el.flatMap((x)=>x[1]-x[0]+1).reduce((acc,curr)=>acc*curr,1)}).reduce((ac,cur)=> ac+cur,0))
  console.log('Part 2 answer - accepted ranges ',acceptedRanges.flatMap((el)=>{el.shift(); return el.flatMap((x)=>x[1]-x[0]+1).reduce((acc,curr)=>acc*curr,1)}).reduce((ac,cur)=> ac+cur,0)) // Part 2 answer

// Rejected ranges plus accepted ranges should sum to 167409079868000



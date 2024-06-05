const fs = require('fs');
const { get } = require('https');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=> {let [a,b]=x.split(' '); return [a,b.split(',').map((n)=>parseInt(n))]})

/*
  Solution based on https://github.com/clrfl/AdventOfCode2023/blob/master/12/explanation.ipynb
  (There are quite a few DFA solutions but this was the only one I could understand)
  
  ***** Part 1 - Example walkthrough *****

  line = .?#.??#???. 1,2,1

  ** STEP 1 - Trim extra '.' **
  Remove leading and trailing '.', replace runs of multiple dots e.g. '...' -> '.'

  -> ?#.??#??? 1,2,1

  ** STEP 2 - Create array of all possible states **
  1,2,1 in regex form is ([.]*#[.]+##[.]+#[.])

             states index:  [ 0    1    2    3    4    5    6    7 ]
  states array looks like:  ['.', '#', '.', '#', '#', '.', '#', '.']

  indexes [0,1] are starting states, [6,7] are end states

  ** STEP 3 - Traverse string and count all possible states at each index **
    
    stateidx| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
        +---+---+---+---+---+---+---+---+---+
     states | . | # | . | # | # | . | # | . | stateCount
        +---+---+---+---+---+---+---+---+---+
        | ? | 1   1                         | {0:1,1:1} Special case - populate valid start states with 1
        +---+---+---+---+---+---+---+---+---+
        | # | -   1*  -                     | {1:1} State 0 to 1 is valid, but State 1 to 2 ('.') is not 
        +---+---+---+---+---+---+---+---+---+       as current char is '#'
        | . |         1                     | {2:1}
        +---+---+---+---+---+---+---+---+---+
          ? |         1   1                 | {2:1,3:1} -> State 2 can repeat, and also go to State 3
        +---+---+---+---+---+---+---+---+---+
          ? |         1   1   1             | {2:1,3:1,4:1}
        +---+---+---+---+---+---+---+---+---+
          # |         -   1*  1   -         | {3:1,4:1} -> State 2 can't repeat, State 4 to 5 is not valid
        +---+---+---+---+---+---+---+---+---+
          ? |                 1   1         | {4:1,5:1}
        +---+---+---+---+---+---+---+---+---+
          ? |                     2   1     | {5:2,6:1} -> State 5 repeats, State 4 also goes to State 5
        +---+---+---+---+---+---+---+---+---+
          ? |                     -   2   1 | {6:2,7:1} -> Count end states -> 3 arrangements
        +---+---+---+---+---+---+---+---+---+

        *Any time a '#' state which is the first in a broken group coincides with a '#' in the string - add to consumed list as this is the last index it can be seen at. e.g. can't have broken springs before State 1

        Other non-advancing conditions
        - State index is less than highest consumed index
        - No more wriggle room - where wriggle = springs.length - (sum of broken + broken.length)
  
*/

function getArrangements (spr,br,p1orp2) {
  let springsSplit
  let brokenMap
  if (p1orp2 === 'p1') {
    springsSplit = spr.replaceAll(/[.]+/g,'.').replaceAll(/(^[.]+|[.]+$)/gm,'').split('')
    brokenMap = br.map((x)=> '#'.repeat(x)).join('.').split('')
  } else {
    springsSplit = Array(5).fill(spr).join('?').replaceAll(/[.]+/g,'.').replaceAll(/(^[.]+|[.]+$)/gm,'').split('')
    brokenMap = Array(5).fill(br.join(',')).flatMap((x)=> x.split(',').map((y)=> parseInt(y))).map((z)=> '#'.repeat(z)).join('.').split('')
  }

  let sprLength = springsSplit.length;
  let wriggle = sprLength-brokenMap.length;
  let states = ['.'].concat(brokenMap,'.');
  let endStateIdx = states.length-1;
  let secondLastStateIdx = endStateIdx-1;
  let statesCount = new Map();
  let consumedIndex = [];
  
  // Set starting states
  statesCount.set(0,1)
  statesCount.set(1,1)

  if (springsSplit.at(0) === '#') { 
    statesCount.delete(0);
    consumedIndex.push(1);
  }

  if (springsSplit.at(0) === '.') {
    statesCount.delete(1);
  } 

  for(i=1;i<sprLength;i++) { // Loop through springs
    let nextStates=new Map();
    let spring = springsSplit.at(i)
    let spridx = i

    statesCount.forEach((stateVal, stateIdx) => { // Loop through previous states
      let wriggleIndex = stateIdx+wriggle;
      let prevState = states[stateIdx];
      let nextState = states[stateIdx+1];

      if (spridx<=wriggleIndex && (consumedIndex.length === 0 || stateIdx >= consumedIndex.at(-1))) {

        // Check if next state is valid and advance
        if (stateIdx<endStateIdx) {
          if ((nextState === '#' && spring !== '.'|| nextState === '.' && spring !== '#') && (stateIdx<secondLastStateIdx-1||!springsSplit.join('').substring(spridx+1).includes('#'))) {
            let nextStateVal = 0;

            if (nextState === '.' && statesCount.has(stateIdx+1)) { 
              nextStateVal=statesCount.get(stateIdx+1); // Get prev count to add to
            }

            nextStates.set(stateIdx+1,stateVal+nextStateVal);
          }
        }
        
        // If prev state is '.' and was not advanced to - check if can repeat
        if (prevState === '.' && spring !== '#' && !statesCount.has(stateIdx-1)) {
          nextStates.set(stateIdx,stateVal)
        }
      }
      

    });

    // Check if consumedIndex needs to be updated
    if (spring === '#') {
      let earliestSpring = [...nextStates.keys()].sort((a,b)=> a-b).find((x)=> states[x] === '#')
      if (earliestSpring !== undefined && states[earliestSpring-1] === '.') {
        consumedIndex.push(earliestSpring)
      }
    }
    
    statesCount = nextStates // Update states

  }

  return [...statesCount.keys()].filter((x)=> x === secondLastStateIdx || x === endStateIdx).map((y)=> statesCount.get(y)).reduce((acc,curr)=> acc+curr,0)
}

let p1sum = 0
let p2sum = 0

lines.forEach(([springs,broken])=> {
  p1sum += getArrangements(springs,broken,'p1')
  p2sum += getArrangements(springs,broken,'p2')
})
console.log(p1sum) // Part 1 answer
console.log(p2sum) // Part 2 answer



const fs = require('fs');
const input = fs.readFileSync('../day5input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/\n\n/);
const seeds = lines[0].split(' ').slice(1).map(Number);
const maps = lines.slice(1).map((x,ix)=>x.split(/[\r\n]+/).slice(1).map((y,yx)=>y.split(' ').map(Number))).map((y)=>y.map((x,ix)=>[x[1],x[1]+x[2]-1,x[0]-x[1]]).sort((a,b)=>a[0]-b[0]));

// Part 1
const lookup = (currVal,ranges) => {
  let inRange = ranges.find(([start,end,offset])=>start<=currVal && end>=currVal)

  if(!inRange){
    return currVal
  } else {
    return currVal+inRange[2]
  }
}

console.log(Math.min(...seeds.map((x)=>maps.reduce((acc,curr)=>lookup(acc,curr),x))))

// Part 2
let seedRanges = seeds.flatMap((x,ix,arr)=>ix % 2 === 0 ? [[x,x+arr[ix+1]-1]]:[]).sort((a,b)=>a[0]-b[0])

const testOverlap = ([x1,x2],[y1,y2,offset]) => {
    if(Math.max(x1,y1) <= Math.min(x2,y2)){
      return [x2>y2 ? [y2+1,x2] : [],[x1<y1 ? [x1,y1-1] : [],[Math.max(x1,y1)+offset,Math.min(x2,y2)+offset]].filter((x)=>x.length>0)] // returns [<remaining interval after range>,[<interval before range + offset>,<interval within range + offset>]
    } else {
      return [[x1,x2],[]] // No overlap
    }
}

const lookupRanges = ([rmin,rmax],ranges2) => {
  if(rmax<ranges2[0][0]||rmin>ranges2.at(-1)[1]){
    return [[rmin,rmax]]
  } else {
    let newRanges = []
    let next

    for(i=0;i<ranges2.length;i++){
      let [thisMin,thisMax,thisOffset] = ranges2[i]

      next = testOverlap([rmin,rmax],[thisMin,thisMax,thisOffset])

      if(next[1].length === 0){
        if(i===ranges2.length-1 && next[0].length>0){
          newRanges.push(next[0]) // Some interval past end of ranges
        }
        continue;
      } else {
        newRanges.push(...next[1])
      }

      if(next[0].length>0){
          rmin = next[0][0]
          rmax = next[0][1]
      } else {
        break;
      }
    }

    return newRanges
  }
}

console.log(Math.min(...maps.reduce((acc,curr)=>acc.flatMap((x)=>lookupRanges(x,curr)),seedRanges).flat()))
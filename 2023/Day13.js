const fs = require('fs');
const input = fs.readFileSync('../day13input.txt',{ encoding: 'utf8', flag: 'r' });

const mirrors = input.split(/$[\r\n]{1,2}^$[\r\n]{1,2}^/m)

function getDifference(rowcol1,rowcol2) {
  return rowcol1.split('').map((x,idx)=> rowcol2.charAt(idx) === x ? 0 : 1).reduce((acc,curr)=> acc+curr)
}

function findReflections(allMirrors,p1orp2) {
  let total = 0
  let allowedDifference

  p1orp2 === 'part1' ? allowedDifference = 0 : allowedDifference = 1

  allMirrors.forEach((mirror)=> {
    var rows = mirror.split(/[\r\n]+/)
    var xlength = rows.length
    var found = false
    var rowCheck
    
    for (i=0;i<xlength-1;i++){ // Check rows

      if (p1orp2 === 'part1') {
        rowCheck = rows[i] === rows[i+1]
      } else {
        rowCheck = (rows[i] === rows[i+1] || getDifference(rows[i],rows[i+1]) === 1)
      }

      if (!!rowCheck) {
        var notMatching
        p1orp2 === 'part2' && getDifference(rows[i],rows[i+1]) === 1 ? notMatching=1 : notMatching=0

        var r1 = i
        var r2 = i+1
        while(r1 > 0 && r2 < xlength-1) {
          r1--;
          r2++;
          notMatching += getDifference(rows[r1],rows[r2]);
        }
  
        if (notMatching === allowedDifference) {
          total+=((i+1)*100);
          found=true;
          break;
        }
      }
    }
  
    if (found === false) { // Check columns
      
      var colSplit = rows.map((x)=> x.split(''));
      var cols = colSplit[0].map((val, index) => colSplit.map(row => row[index]).join(''));
      var ylength = cols.length;
      var colCheck

      for (i=0;i<ylength-1;i++){
        if (p1orp2 === 'part1') {
          colCheck = cols[i] === cols[i+1]
        } else {
          colCheck = (cols[i] === cols[i+1] || getDifference(cols[i],cols[i+1]) === 1)
        }

        if (!!colCheck) {
          var notMatching
          p1orp2 === 'part2' && getDifference(cols[i],cols[i+1]) === 1 ? notMatching=1 : notMatching=0;
  
          var c1 = i;
          var c2 = i+1;
          while(c1 > 0 && c2 < ylength-1) {
            c1--;
            c2++;
            notMatching += getDifference(cols[c1],cols[c2]);
          }
  
          if (notMatching === allowedDifference) {
            total+=i+1;
            found=true;
            break;
          }
        }
      }
    }
  
  })

  return total
}

console.log(findReflections(mirrors,'part1')) // Part 1 answer
console.log(findReflections(mirrors,'part2')) // Part 2 answer
const fs = require('fs');
const input = fs.readFileSync('../day13input.txt',{ encoding: 'utf8', flag: 'r' });

const mirrors = input.split(/$[\r\n]{1,2}^$[\r\n]{1,2}^/m)

function rowDifference(row1,row2) {
  return row1.split('').map((x,idx)=> row2.charAt(idx) === x ? 0 : 1).reduce((acc,curr)=> acc+curr)
}

//Part 1
let p1total=0 

mirrors.forEach((mirror,mirroridx)=> {
  var rows = mirror.split(/[\r\n]+/)
  var xlength = rows.length
  var found = false

  for (i=0;i<xlength-1;i++){
    if (rows[i] === rows[i+1]) {
      var notMatching = 0
      var r1 = i
      var r2 = i+1
      while(r1 > 0 && r2 < xlength-1) {
        r1--
        r2++
        notMatching += rowDifference(rows[r1],rows[r2])
      }

      if (notMatching === 0) {
        p1total+=((i+1)*100)
        found=true
        break;
      }
    }
  }

  if (found === false) {
    var colSplit = rows.map((x)=> x.split(''))
    var cols = colSplit[0].map((val, index) => colSplit.map(row => row[index]).join(''));
    var ylength = cols.length

    for (i=0;i<ylength-1;i++){
      if (cols[i] === cols[i+1]) {
        var notMatching = 0
        var c1 = i
        var c2 = i+1
        while(c1 > 0 && c2 < ylength-1) {
          c1--
          c2++
          notMatching += rowDifference(cols[c1],cols[c2])
        }

        if (notMatching === 0) {
          p1total+=i+1
          found=true
          break;
        }
      }
    }
  }

})

console.log(p1total) // Part 1 answer

//Part 2
let p2total = 0

mirrors.forEach((mirror,mirroridx)=> {
  var rows = mirror.split(/[\r\n]+/)
  var xlength = rows.length
  var found = false

  for (i=0;i<xlength-1;i++){
    if (rows[i] === rows[i+1] || rowDifference(rows[i],rows[i+1]) === 1) {
      var notMatching
      rowDifference(rows[i],rows[i+1]) === 1 ? notMatching=1 : notMatching=0
      var r1 = i
      var r2 = i+1
      while(r1 > 0 && r2 < xlength-1) {
        r1--
        r2++
        notMatching += rowDifference(rows[r1],rows[r2])
      }

      if (notMatching === 1) {
        p2total+=((i+1)*100)
        found=true
        break;
      }
    }
  }

  if (found === false) {
    var colSplit = rows.map((x)=> x.split(''))
    var cols = colSplit[0].map((val, index) => colSplit.map(row => row[index]).join(''));
    var ylength = cols.length

    for (i=0;i<ylength-1;i++){
      if (cols[i] === cols[i+1] || rowDifference(cols[i],cols[i+1]) === 1) {
        var notMatching
        rowDifference(cols[i],cols[i+1]) === 1 ?notMatching=1 : notMatching=0
        var c1 = i
        var c2 = i+1
        while(c1 > 0 && c2 < ylength-1) {
          c1--
          c2++
          notMatching += rowDifference(cols[c1],cols[c2])
        }

        if (notMatching === 1) {
          p2total+=i+1
          found=true
          break;
        }
      }
    }
  }

})

console.log(p2total) // Part 2 answer


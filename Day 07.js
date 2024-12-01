const fs = require('fs');
const input = fs.readFileSync('../2016/day7input.txt',{ encoding: 'utf8', flag: 'r' });
const lines1 = input.split(/[\r\n\s+]+/).map((x)=>x.split(''))

function tls (lines,partNo) {
  let count = 0
  let windowLen = partNo === 1 ? 4 : 3

  for(i=0;i<lines.length;i++){
    let line = lines[i].slice();
    let window = ['_', ...line.splice(0,windowLen-1)];

    let outsideBracket = true;
    let outside = false;
    let inside = false;
    let outABA = [];
    let inABA = [];

    const windowTest = (window,partNo) => {
      return partNo === 1 ? window[0] !== window[1] && window[0] === window[3] && window[1]===window[2] : window[0] !== window[1] && window[0] === window[2]
    }

    const tlsTest = (partNo) => {
      return partNo === 1 ? outside && !inside : outside && inside && outABA.some((x)=>inABA.indexOf(`${x.charAt(1)}${x.charAt(0)}${x.charAt(1)}`) !== -1)
    }
  
    while(line.length>0){
      window.shift();
      window.push(line.shift());

      if(windowTest(window,partNo)){
        if(outsideBracket){
          outside = true;
          if (partNo===2) outABA.push(window.join(''));
        } else {
          inside = true;
          if (partNo===1) break;
          if (partNo===2) inABA.push(window.join(''));
        }
      }
  
      if(line[0]==='[' || line[0]===']'){
        outsideBracket = line[0]==='[' ? false : true;
        line.shift();
        window = ['_', ...line.splice(0,windowLen-1)];
        continue;
      }
    }

    if(tlsTest(partNo)){
      count++
    }  
  }

  return count
}

console.log(tls(lines1,1))
console.log(tls(lines1,2))

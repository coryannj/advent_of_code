const fs = require('fs');
require('../../utils.js');
const input = fs.readFileSync('../2016/day9input.txt',{ encoding: 'utf8', flag: 'r' });

const arr1 = input.split('')

function decompress (arr,partNo) {
  let result = 0;

  while(arr.length>0 && arr.includes('(')){
    while(arr[0] !== '('){
      arr.shift();
      result++;
    }
    let [numChars,repeats] = arr.splice(0,arr.indexOf(')')+1).slice(1,-1).join('').split('x').map(Number);

    let decompressed = arr.splice(0,numChars);
    
    if(partNo === 2 && decompressed.includes('(')){
      result += (decompress(decompressed,2)*repeats);
    } else {
      result += (decompressed.length*repeats);
    }
  }
  result+=arr.length

  return result
}

console.log(decompress(arr1.slice(),1))
console.log(decompress(arr1.slice(),2))
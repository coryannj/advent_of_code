const fs = require('fs');
const input = fs.readFileSync('../day13input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/\n\n/).map((x)=> x.split(/[\r\n]+/).map((y)=>JSON.parse(y)))
console.log(lines[1][0])

//console.log(JSON.parse(lines[0][0]))

let left = [[8,[[7]]]]
let right =[[[[8]]]]
console.log(left[0][0])
console.log(right[0][0])


lines.forEach(([left,right],pairIndex)=>{
    console.log('*** NEW LINE ***')
    console.log(left)
    console.log(right)

    function compare(left,right) {
        if (typeof left === 'number' && typeof right === 'number') {
            if(left>right){
                return -1
            } else if (right>left){
                return 1
            } else {
                return 0
            }
        } else if (typeof left === 'array' && typeof right === 'array') {

        } else {
            // one is an integer
            typeof left === 'number' ? left=[left]:right=[right]

        }
    }


    for(i=0;i<left.length;i++){
        let leftitem = left[0]
        let rightitem = right[0]




        console.log('i is ',i)
        console.log('leftitem is ',leftitem)
        console.log('rightitem is ',rightitem)
    }

})

console.log([[]].length)
console.log([].length)


const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2018/day20.txt', {encoding: "utf8", flag: "r", });

//let str = '^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$'
let str = input
console.log(str.length)
console.log(str.replaceAll(/(NS|SN|EW|WE)/g,'').replaceAll(/(NEWS|NWES|SWEN|SEWN|ENSW|ESNW|WNSE|WSNE)/g,'').replaceAll("(|)",'').length)







const cartesian =
  (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

let t = JSON.parse(("["+str.replaceAll('|)','""],').replaceAll(/[\\)\\|\\(]/g,m=>{
    if(m ==='^' || m === '('){
        return '['
    } else if (m === '$' || m === ')'){
        return '],'
    } else {
        return ','
    }
}).replaceAll(/(\w+)/g,m=> '"'+m+'",').slice(1,-1)+"]").replaceAll(',,',',').replaceAll(',]',']'))
//console.log(t)
const allOptions = (arr,result = ['']) => {
    //console.log('  NEW LINE  ')
    //console.log(' arr is ',arr, ' result is ',result)
    if(arr.every((x)=>typeof x === 'string')) return cartesian(result,arr)

    while(arr.length){
        let n = arr.shift()
        if(typeof n === 'string'){
            result = result.map((x)=>x+n)
        } else {
            result = allOptions(n,result)
        }
        //console.log('result is ',result, 'n was ',n)
    }
    //console.log('result is ',result,' arr is ',arr)
    
    return result
}

console.log(allOptions(t))




let v = JSON.parse("["+str.slice(1,-1).replaceAll('|)','],[[0,0]]],').replaceAll(/([()|NEWS])/g,m=> {
    if(m ==='^' || m === '('){
        return m ==='^' ? '[' : '[['
    } else if (m === '$' || m === ')'){
        return m === '$' ? ']' : ']],'
    } else if(m === '|'){
        return '],['
    } else {
        return dirs[m]
    }
})+"]")

console.log(v)
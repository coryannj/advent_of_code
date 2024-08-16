const fs = require('fs');
const input = fs.readFileSync('../day8input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(' ')).map((x,ix)=>[ix].concat(x.map((y,yx)=> yx === 0 ? y : Number(y))))

let acc = 0

let loop = lines.slice()
//loop[29] = [ 29, 'nop', 323 ]
//console.log(loop[29])

let queue = [loop[0]]
let seen = new Set()
//console.log(!seen.has(queue[0][0]))

while(queue.length>0 && !seen.has(queue[0][0])){
    let [ind,dir,val] = queue.shift()
    seen.add(ind)

    if(dir === 'acc'){
        acc += val
        queue.push(loop[ind+1])
        console.log([ind,dir,val],loop[ind+1],acc)
    }

    if(dir === 'jmp'){
        queue.push(loop[ind+val])
        console.log([ind,dir,val],loop[ind+val])
    }

    if(dir === 'nop'){
        queue.push(loop[ind+1])
        console.log([ind,dir,val],loop[ind+1])
    }
}
console.log(acc)
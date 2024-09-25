const fs = require('fs');
const input = fs.readFileSync('../day23input.txt',{ encoding: 'utf8', flag: 'r' });

const numRegex = /([-]{0,1}\d+)/g

let lines = input.split(/[\r\n]+/).map((x)=>x.match(numRegex).map(Number))

function testOverlap(point1,point2){
    let [x1,y1,z1,r1] = point1
    let [x2,y2,z2,r2] = point2

    let overlap = Math.abs(x2-x1)+Math.abs(y2-y1)+Math.abs(z2-z1)

    return [overlap<=r1,overlap]
}

let maxR = lines.map((x)=>x.at(-1)).sort((a,b)=>b-a)[0]
let maxCoord = lines.find((x)=>x.at(-1)===maxR)

let rest = lines.map((x)=>testOverlap(maxCoord,x)).filter((x)=>x[0]===true)
console.log(rest.length)


let allOverlaps=lines.map((x,ix,arr)=>[x,arr.map((y)=>testOverlap(x,y)).filter((z)=>z[0]===true).length]).sort((a,b)=>b[0]-a[0])
console.log(allOverlaps)

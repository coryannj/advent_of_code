const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../../day4.txt', {encoding: "utf8", flag: "r", });

let arr = input.lines().map((x)=>'___'+x+'___')
let collen = arr[0].length
arr.unshift(...Array(3).fill(0).map((x)=>"_".repeat(collen)))
arr.push(...Array(3).fill(0).map((x)=>"_".repeat(collen)))
let rowlen = arr.length
arr = arr.mk2d()

const getLetter = (l) => arr.flatMap((x,xi)=>x.flatMap((y,yi)=>y===l ? [[xi,yi]] : []))

let p1queue = getLetter('X')
let p1Len = p1queue.length

for(i=0;i<p1Len;i++){
    let [r,c] = p1Len[i]

    for(j=r+1;j<=r+3;j++){
        for(k=c+1;k<3;k++){

        }
    }
}










let all = arr.map((e,i)=>e.map((c,cx)=>[i,cx,c]))
//console.log(all.flat())

let queue = all.flat().filter((x)=>x[2]==='X')



const xmas = ([r,c]) => {
   return [
        Array(4).fill([r,c]).map(([r,c],ix)=>[r,c+ix]),
        Array(4).fill([r,c]).map(([r,c],ix)=>[r,c-ix]),
        Array(4).fill([r,c]).map(([r,c],ix)=>[r+ix,c]),
        Array(4).fill([r,c]).map(([r,c],ix)=>[r-ix,c]),
        Array(4).fill([r,c]).map(([r,c],ix)=>[r+ix,c+ix]),
        Array(4).fill([r,c]).map(([r,c],ix)=>[r+ix,c-ix]),
        Array(4).fill([r,c]).map(([r,c],ix)=>[r-ix,c-ix]),
        Array(4).fill([r,c]).map(([r,c],ix)=>[r-ix,c+ix]),
    ].filter((x)=>x.every(([nr,nc])=>0<=nr && nr<rowlen && 0<=nc && nc<collen) && x.map(([nr,nc])=>arr[nr][nc]).join('')==='XMAS').length
}

console.log(queue.map(([r,c,v])=>xmas([r,c])).sum())

const mas = ([r,c]) => {
   let next =  [[r-1,c-1],[r-1,c+1],[r,c],[r+1,c-1],[r+1,c+1]
    ]

    return next.every(([nr,nc])=>0<=nr && nr<rowlen && 0<=nc && nc<collen) && (next.map(([nr,nc])=>arr[nr][nc]).join('')==='MSAMS'||next.map(([nr,nc])=>arr[nr][nc]).join('')==='SSAMM'||next.map(([nr,nc])=>arr[nr][nc]).join('')==='MMASS'||next.map(([nr,nc])=>arr[nr][nc]).join('')==='SMASM')
}

//console.log(all.flat().filter((x)=>x[2]==='A'))


console.log(all.flat().filter((x)=>x[2]==='A').filter((x)=>mas([x[0],x[1]])).length)


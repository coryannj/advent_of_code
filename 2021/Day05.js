const fs = require('fs');
const input = fs.readFileSync('../day5input.txt',{ encoding: 'utf8', flag: 'r' });
const numRegex = new RegExp(/\d+/, 'g');

let lines = input.split(/[\r\n]+/).map((x)=>x.match(numRegex).map(Number)).map((y)=>[[y[0],y[1]],[y[2],y[3]]].sort((a,b)=>{
    if(a[0]===b[0]){
        return a[1]-b[1]
    } else {
        return a[0]-b[0]
    }
}))
//console.log(lines)

let straightLines = lines.filter(([[r1,c1],[r2,c2]])=> (r1 === r2 && c1 !== c2) || (r1 !== r2 && c1 === c2))

//console.log(straightLines)

let p1points = {}

straightLines.forEach(([[c1,r1],[c2,r2]])=>{
    if(r1 === r2){
        for(i=c1;i<=c2;i++){
            p1points[`${r1}-${i}`] = (p1points[`${r1}-${i}`]?? 0) +1
        }
    }else{
        for(j=r1;j<=r2;j++){
            p1points[`${j}-${c1}`] = (p1points[`${j}-${c1}`]?? 0) +1
        }
    }
})

console.log(Object.values(p1points).filter((x)=> x>1).length) // Part 1

let diagonalLines = lines.filter(([[r1,c1],[r2,c2]])=> r1 !== r2 && c1 !== c2)



diagonalLines.forEach(([[c1,r1],[c2,r2]])=>{
    let steps = Math.abs(c2-c1)
    for(k=0;k<=steps;k++){
        let thisR = r2>r1 ? r1+k : r1-k
        let thisC = c2>c1 ? c1+k : c1-k
        p1points[`${thisR}-${thisC}`] = (p1points[`${thisR}-${thisC}`]?? 0) +1
    }

})

console.log(Object.values(p1points).filter((x)=> x>1).length) // Part 1
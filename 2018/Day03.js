const fs = require('fs');
const input = fs.readFileSync('../day3input.txt',{ encoding: 'utf8', flag: 'r' });

const numRegex = /\d+/g

let lines = input.split(/[\r\n]+/).map((x)=>x.match(numRegex).map(Number))

let rectangles = lines.map(([id,col,row,w,h])=>{
    return [row,row+h-1,col,col+w-1]
})

// Part 1
let allX = [...new Set(rectangles.flatMap((x)=>x.slice(0,2)))].sort((a,b)=>a-b)
let allY = [...new Set(rectangles.flatMap((x)=>x.slice(2)))].sort((a,b)=>a-b)
let [minX,maxX,minY,maxY] = [allX[0],allX.at(-1),allY[0],allY.at(-1)]

let squares = 0

for(i=minX;i<=maxX;i++){
    for(j=minY;j<=maxY;j++){
        let claims = rectangles.filter(([x1,x2,y1,y2])=>x1 <= i && i<= x2 && y1 <= j && j<= y2)
        if(claims.length>1){
            squares++
        }
    }
}

console.log(squares) // Part 1 answer

// Part 2
function testOverlap(range1,range2){
    let [x1,x2,y1,y2] = range1
    let [bx1,bx2,by1,by2] = range2

    return Math.max(x1,bx1) <= Math.min(x2,bx2) && Math.max(y1,by1) <= Math.min(y2,by2)
}

let overlap
let rLen = rectangles.length

for(l=0;l<rLen;l++){
    let thisClaim = rectangles[l]

    let checkOverlaps = rectangles.filter((x,ix)=>ix !== l).map((x)=>testOverlap(thisClaim,x)).filter((x)=> x!==false)

    if(checkOverlaps.length === 0){
        overlap = thisClaim
        break;
    }
}

console.log(lines.find(([id,col,row,w,h])=>row === overlap[0] && col === overlap[2])[0]) // Part 2 answer
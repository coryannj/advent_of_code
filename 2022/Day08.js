const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day8input.txt',{ encoding: 'utf8', flag: 'r' });

let rows = input.split(/[\r\n]+/).map((x)=>x.split('').map(Number));
let cols = rows[0].map((x,i) => rows.map(x => x[i]));

// Part 1
let rowlen = rows.length
let collen = cols.length

let visible = 0

for (r=0;r<rowlen;r++){
    for(c=0;c<collen;c++){
        let val = rows[r][c];
        if (r === 0 || r === rowlen-1 || c === 0 || c === collen-1) {
            visible++
        } else {
            let checkLeft = rows[r].some((x,idx)=> idx<c && x>=val);
            let checkRight = rows[r].some((x,idx)=> idx>c && x>=val);
            let checkUp = cols[c].some((y,idx)=>idx<r && y>=val);
            let checkDown = cols[c].some((y,idx)=>idx>r && y>=val);

            if([checkLeft,checkRight,checkUp,checkDown].includes(false)){
                visible++
            }
        }
    }
}

console.log(visible) // Part 1

//Part 2
// All the 8s and 9s are in the center of the grid - start by iterating over those

let maxScenic = 0

let nines = rows.flatMap((x,xidx)=> 
    x.flatMap((y,yidx)=>{
        if (y > 7) {
            return [[xidx,yidx]]
        } else {
            return []
        }
    })
)

nines.forEach(([r,c])=>{
    let val = rows[r][c]
    function getVisible(row,col,dir){
        if((row===0 && dir==='L')||(row===rowlen-1 && dir === 'R')||(col===0 && dir === 'U')||(col===collen-1 && dir === 'D')) {
            return 0
        } else {
            let indMap = {
                'L':rows[r].findLastIndex((x,idx)=> idx<c && x>=val),
                'R':rows[r].findIndex((x,idx)=> idx>c && x>=val),
                'U':cols[c].findLastIndex((y,idx)=>idx<r && y>=val),
                'D':cols[c].findIndex((y,idx)=>idx>r && y>=val)
            }
            let ind = indMap[dir]
            let adjustedInd
            if(ind === -1){
                if(dir === 'L' || dir === 'U'){
                    adjustedInd = 0
                } else {
                    adjustedInd = rowlen-1
                }
            } else {
                adjustedInd = ind
            }
            let visibleMap = {
                'L':col-adjustedInd,
                'R':adjustedInd-col,
                'U':row-adjustedInd,
                'D':adjustedInd-row
            }

            return visibleMap[dir]
        }

    }

    let visibleLeft = getVisible(r,c,'L')
    let visibleRight = getVisible(r,c,'R')
    let visibleUp = getVisible(r,c,'U')
    let visibleDown = getVisible(r,c,'D')

    if(![visibleLeft,visibleRight,visibleUp,visibleDown].includes(0)){
        let scenic = visibleLeft*visibleRight*visibleUp*visibleDown
        if (scenic>maxScenic){
            maxScenic = scenic
        }
    }

})

console.log(maxScenic) // Part 2 answer
const fs = require('fs');
const input = fs.readFileSync('../day11input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/)
let rowLen = lines.length
let colLen = lines[0].length

let plines = lines.map((x)=>x.split('').map(Number))
let steps = 0
let flashCounter = 0
let allOctupusesFlash = false

while(!allOctupusesFlash){
    let addOne = plines.map((x)=>x.map((y)=>y+1))
    let flashes = addOne.flatMap((x,ix)=> x.map((y,yix)=> y === 10 ? [ix,yix]:[])).filter((z)=>z.length>0)
    let flashKeys = flashes.map(([r,c])=>`${r}-${c}`)
    steps++

    if(flashes.length > 0){
        while(flashes.length>0){
            let [r,c] = flashes.shift()
            flashCounter++
            let surrounding = [[r-1,c-1],[r-1,c],[r-1,c+1],[r,c+1],[r+1,c+1],[r+1,c],[r+1,c-1],[r,c-1]].filter(([nr,nc])=>0<=nr&&nr<rowLen&&0<=nc&&nc<colLen&&!flashKeys.includes(`${nr}-${nc}`)&&addOne[nr][nc]<10)
            
            surrounding.forEach(([sr,sc])=>{
                    addOne[sr][sc]++
                    if(addOne[sr][sc] >= 10){
                        flashes.push([sr,sc])
                        flashKeys.push(`${sr}-${sc}`)
                    }
            })
            addOne[r][c] = 0
        }
    }
    plines = addOne;
    
    if(steps===100){
        console.log('P1 answer is',flashCounter)
    }

    if(flashKeys.length===100){
        let dedupe = [...new Set(flashKeys)]

        if(dedupe.length === 100){
            console.log('P2 answer is',steps)
            break;
        }
    }
}

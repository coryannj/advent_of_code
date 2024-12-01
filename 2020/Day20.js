const fs = require('fs');
const input = fs.readFileSync('../day20input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\n/).map((x)=>x.split(/[\r\n]+/)).map((x)=>[x[0].slice(5,9),x.slice(1).map((y)=>y.split(''))])

let rowlen = lines[0][1].length;
let collen = lines[0][1][1].length;
let gridlen = Math.sqrt(lines.length);

let tiles = {}

lines.forEach(([k,tile])=>{
    tiles[k] = {
        'T': {'value':[tile[0],tile[0].slice().reverse()].map((x)=>x.join('')),'matchId':''},
        'R': {'value':[tile.map((x)=>x[collen-1]),tile.map((x)=>x[collen-1]).reverse()].map((x)=>x.join('')),'matchId':''},
        'B': {'value':[tile[rowlen-1],tile[rowlen-1].slice().reverse()].map((x)=>x.join('')),'matchId':''},
        'L': {'value':[tile.map((x)=>x[0]),tile.map((x)=>x[0]).reverse()].map((x)=>x.join('')),'matchId':''},
    }    
})

// Part 1
let corners = []

// Build adjacency map - anything with only 2 adjacent is a corner
Object.keys(tiles).forEach((k)=>{
    let matchCount = 0;

    Object.entries(tiles[k]).forEach(([dir,v])=>{
        let [m1,m2] = v.value;

        let matchKey = Object.keys(tiles).find((ok)=>{
            return ok !== k && Object.entries(tiles[ok]).map((x)=>x[1].value).filter(([v1,v2])=>(v1 === m1 && v2 === m2)||(v1 === m2 && v2 === m1)).length>0
        });

        if(matchKey !== undefined){
            matchCount++
            tiles[k][dir]['matchId'] = matchKey
        }
    })

    if(matchCount===2){
        corners.push(k)
    }
})

console.log('Part 1 answer is ',corners.map((x)=>parseInt(x)).reduce((acc,curr)=>acc*curr,1)) // Part 1 answer

// Part 2

function getAdjacent(tileKey,nextMatchCount){
    return Object.entries(tiles[tileKey]).flatMap((x)=>{
        let matchKey = x[1].matchId
        if(matchKey.length > 0){        
            return Object.entries(tiles[matchKey]).map((y)=>y[1].matchId).filter((z)=>z.length>0).length<nextMatchCount ? [[x[0],matchKey]]:[]
        } else {
            return []
        }
    })
}

// Build first row of grid with tile numbers
let rowQueue = [corners[0]]
let otherCorners = corners.slice(1)
let firstRow = []

while(!firstRow.some((x)=>otherCorners.includes(x))){
    let key = rowQueue.shift()
    firstRow.push(key)
    rowQueue.push([...getAdjacent(key,4)].filter(([k,v])=> !firstRow.includes(v))[0][1])
}

let grid = [firstRow]

// Map each row - tile below will be only adjacent tile Id not in prev rows
for(i=1;i<gridlen;i++){
    let allKeys = grid.flat()
    grid.push(grid[i-1].map((x)=>[...getAdjacent(x,5)].map((z)=>z[1]).find((y)=> !allKeys.includes(y))))
}

function rotateGrid(arr,[flip,degrees]){
    let matrix = structuredClone(arr)
    
    if(flip === 'x'){
        matrix.reverse()
    }

    if(degrees === '0'){
        return matrix
    } else if (degrees === '90'){
        return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())
    } else if (degrees === '180'){
        return matrix.reverse().map((x)=>x.reverse())
    } else {
        return matrix[0].map((val, index) => matrix.map(row => row[row.length-1-index]))
    }
}

const findRotate = {
    '0-0':'TRBL', // No flip
    '0-90':'LTRB',
    '0-180':'BLTR',
    '0-270':'RBLT', 
    'x-0':'BRTL', // Flip on x axis
    'x-90':'LBRT',
    'x-180':'TLBR',
    'x-270':'RTLB' 
}

function getRotation(id,r,c){

    let surrounding = {
        'T':[r-1,c],
        'R':[r,c+1],
        'B':[r+1,c],
        'L':[r,c-1]
    }

    let orientation = Object.values(surrounding).map(([nr,nc])=> 0<=nr && nr < gridlen && 0<=nc && nc <gridlen ? grid[nr][nc] : '').flatMap((mid)=> mid.length > 0 ?Object.keys(tiles[id]).filter((tid)=>tiles[id][tid]['matchId']===mid):[mid])

    let rotation = Object.keys(findRotate).find((x)=> findRotate[x].split('').every((y,yx)=> orientation[yx] === ''||orientation[yx]===y)).split('-')

    let thisTile = lines.find(([lk,lv])=>lk ===id)[1]

    return rotateGrid(thisTile,rotation) // returns complete tile in correct orientation
}

// Place all tiles in correct orientation and remove tile borders
let gridPlaced = structuredClone(grid).map((r,rind)=> r.map((c,cind)=>getRotation(c,rind,cind))).map((x)=>x.map((y)=>y.slice(1,-1).map((z)=>z.slice(1,-1))))

// Form the image
let megaGrid = []

for(i=0;i<gridlen;i++){
    for(j=0;j<rowlen-2;j++){
        megaGrid.push(gridPlaced[i].flatMap((x)=>x[j]))
    }
}

let megaRowLen = megaGrid[0].length

// Each regex line is 20 chars, subtract that from the mega grid no. of cols so we can compress the mega grid into single line
let monsterStr = `(?=(\\W{18}[#]{1}\\W{1}\\W{${megaRowLen-20}}[#]{1}\\W{4}[#]{2}\\W{4}[#]{2}\\W{4}[#]{3}\\W{${megaRowLen-20}}\\W[#]{1}\\W{2}[#]{1}\\W{2}[#]{1}\\W{2}[#]{1}\\W{2}[#]{1}\\W{2}[#]{1}\\W{2}))`

let monsterRegex = new RegExp(monsterStr,"gm");
let hashCount = megaGrid.flat().filter((x)=>x==='#').length;
let megaRotate = Object.keys(findRotate);

for(l=0;l<megaRotate.length;l++){
    let rotationKey = megaRotate[l].split('-')
    let rotatedGridString = rotateGrid(megaGrid,rotationKey).map((x)=>x.join('')).join('')

    if(monsterRegex.test(rotatedGridString)){
        let seaMonsters = [...rotatedGridString.matchAll(monsterRegex)].map((x)=>x.index).length;

        console.log('Part 2 answer is ',hashCount-(seaMonsters * 15)) // Part 2 answer
        break;
    }
}

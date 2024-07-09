const fs = require('fs');
const input = fs.readFileSync('../day22input.txt',{ encoding: 'utf8' });
const pathRegex = /([LR]\d+)/g
let notes = input.split(/\n\n/)

let map = notes[0].split(/[\r\n]+/).map((x)=>x.split(''))
let path = 'R'.concat(notes[1]).match(pathRegex).map((x)=>[x.slice(0,1),parseInt(x.slice(1))])

let rowLen = map.length
let colLen = map[0].length
let cubeLen = 50
let boxInfo = {}

for(i=0;i<rowLen;i+=50){
    for(j=0;j<colLen;j+=50){
        if(map[i][j]==='.'||map[i][j]==='#'){
            let boxindex = (2 * Math.floor(i/50))+(Math.floor(j/50))
            if(boxInfo[boxindex]===undefined){
                boxInfo[boxindex] = {}
                boxInfo[boxindex]['minRow'] = i
                boxInfo[boxindex]['maxRow'] = i+(cubeLen-1)
                boxInfo[boxindex]['minCol'] = j
                boxInfo[boxindex]['maxCol'] = j+(cubeLen-1)
            } 
        }
    }
}

boxInfo['1']['U'] = ['6','R','col',boxInfo['6']['minCol']]
boxInfo['1']['L'] = ['4','R','rowinv',boxInfo['4']['minCol']]
boxInfo['2']['U'] = ['6','U',boxInfo['6']['maxRow'],'col']
boxInfo['2']['R'] = ['5','L','rowinv',boxInfo['5']['maxCol']]
boxInfo['2']['D'] = ['3','L','col',boxInfo['3']['maxCol']]
boxInfo['3']['R'] = ['2','U',boxInfo['2']['maxRow'],'row']
boxInfo['3']['L'] = ['4','D',boxInfo['4']['minRow'],'row']
boxInfo['4']['L'] = ['1','R','rowinv',boxInfo['1']['minCol']]
boxInfo['4']['U'] = ['3','R','col',boxInfo['3']['minCol']]
boxInfo['5']['R'] = ['2','L','rowinv',boxInfo['2']['maxCol']]
boxInfo['5']['D'] = ['6','L','col',boxInfo['6']['maxCol']]
boxInfo['6']['R'] = ['5','U',boxInfo['5']['maxRow'],'row']
boxInfo['6']['L'] = ['1','D',boxInfo['1']['minRow'],'row']
boxInfo['6']['D'] = ['2','D',boxInfo['2']['minRow'],'col']

const nextStep = ([row,col,currentDir],p1orp2) => {

    let nextStepObj = {
        R: [row,col+1],
        L: [row,col-1],
        U: [row-1,col],
        D: [row+1,col]
    }
    let [nr,nc] = nextStepObj[currentDir]
    let newDir = currentDir

    if (nr < 0 || nr >= rowLen || nc < 0 || nc >= colLen || (map[nr][nc] !== '.' && map[nr][nc] !== '#')){
        if(p1orp2==='p1'){
            if(currentDir === 'R' || currentDir === 'L'){
                nc = currentDir === 'R' ? map[nr].findIndex((x)=> x === '.'||x==='#') : map[nr].findLastIndex((x)=> x === '.'||x==='#')
            } else {
                nr = currentDir === 'U' ? map.findLastIndex((x)=> x[nc] === '.'||x[nc]==='#') : map.findIndex((x)=> x[nc] === '.'||x[nc]==='#')
            }
        } else {
            let boxindex = (2 * Math.floor(row/50))+(Math.floor(col/50))
            let [nBox,nDir,nRow,nCol] = boxInfo[boxindex][currentDir]
            newDir = nDir
            if(typeof nRow === 'string'){
                let start = boxInfo[nBox]['minRow']
                let offset = nRow.includes('row') ? row%cubeLen : col%cubeLen
                if(nRow.includes('inv')){
                    nr = start + (cubeLen-1-offset)
                } else {
                    nr = start+offset
                }
                nc = nCol
            }

            if(typeof nCol === 'string'){
                let start = boxInfo[nBox]['minCol']
                let offset = nCol.includes('row') ? row%cubeLen : col%cubeLen
                if(nCol.includes('inv')){
                    nc = start + (cubeLen-1-offset)
                } else {
                    nc = start+offset
                }
                nr = nRow
            }
        }

    }

    if(map[nr][nc] === '#'){
        return [row,col,currentDir]
    } else {
        return [nr,nc,newDir]
    }
}

function nextMove([r,c,dir],[nextdir,steps],p1orp2){    
    
    let nextDirection = {
        R:{R:'D',L:'U'},
        L:{R:'U',L:'D'},
        U:{R:'R',L:'L'},
        D:{R:'L',L:'R'}
    }

    let newDirection = nextDirection[dir][nextdir]
    let lastCoord = [r,c,newDirection]
    let newCoord
    let stepsTaken = 0

   do{
        newCoord = nextStep(lastCoord,p1orp2)
        if(newCoord.every((x,idx)=>lastCoord[idx]===x)){
            break;
        } else {
            stepsTaken++
            lastCoord = newCoord
        }
        
   } while (stepsTaken < steps)

   return newCoord
}

function getPassword(startCoord,p1orp2){
    let getPath = path.slice()
    let currentCoOrd = startCoord
    let counter = 0
    while (getPath.length>0) {
        let instruction = getPath.shift()
        let takeNextMove = nextMove(currentCoOrd,instruction,p1orp2)
        currentCoOrd = takeNextMove
        counter++
    }

    let facing = 'RDLU'
    return ((currentCoOrd[0]+1)*1000) + ((currentCoOrd[1]+1)*4) + facing.indexOf(currentCoOrd[2])
}

let startRow = map.findIndex((x)=> x.includes('.'))
let startCol = map[0].findIndex((x)=> x === '.')
let startPoint = [startRow,startCol,'U']

console.log(getPassword(startPoint,'p1')) // Part 1 answer
console.log(getPassword(startPoint,'p2')) // Part 2 answer

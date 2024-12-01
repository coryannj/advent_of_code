const fs = require('fs');
const input = fs.readFileSync('../day11input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.replaceAll('L','#').split(/[\r\n]+/).map((x)=>x.split(''))

let rowlen = lines.length
let collen = lines[0].length

function adjacent(r,c,arr){
    let val = arr[r][c]
    let surrounding = [[r,c-1],[r+1,c-1],[r+1,c],[r+1,c+1],[r,c+1],[r-1,c+1],[r-1,c],[r-1,c-1]].filter(([row,col])=> 0<=row && row<rowlen && 0<=col && col <collen).map(([row,col])=>arr[row][col])

    if(val === 'L' && surrounding.every((x)=> x === 'L' || x === '.')){
        return '#'
    } else if (val === '#' && surrounding.filter((x)=> x==='#').length>=4){
        return 'L'
    } else {
        return val
    }
}

function seeSeats(r,c,arr){
    let val = arr[r][c]
    let dist = 1
    let adjacent = {
        'U':'','D':'','L':'','R':'','UL':'','UR':'','DL':'','DR':''
    }
    let dirs = ['U','D','L','R','UL','UR','DL','DR']
    
    while(Object.values(adjacent).some((x)=> x === '')){
        let toFind = dirs.filter((x,ix)=>adjacent[x] === '');
        let surrounding = [[r-dist,c],[r+dist,c],[r,c-dist],[r,c+dist],[r-dist,c-dist],[r-dist,c+dist],[r+dist,c-dist],[r+dist,c+dist]].filter((x,ix)=>adjacent[dirs[ix]] === '');
        
        surrounding.forEach(([nr,nc],ix)=> {
            if (0<=nr & nr < rowlen && 0<=nc && nc<collen){
                let found = arr[nr][nc]
                if(found !== '.'){
                    adjacent[toFind[ix]] = found
                }
            } else {
                adjacent[toFind[ix]] = '.'
            }
        })
        dist++
    }
    
    let visible = Object.values(adjacent)

    if(val === 'L' && visible.every((x)=> x === 'L' || x === '.')){
        return '#'
    } else if (val === '#' && visible.filter((x)=> x==='#').length>=5){
        return 'L'
    } else {
        return val
    }
}

function seat(arr,p1orp2){
    let newArr = structuredClone(arr)
    let changed = 0

    for(i=0;i<rowlen;i++){
        for(j=0;j<collen;j++){
            let val = arr[i][j]
            if(val !== '.'){
                let newVal = p1orp2 === 'p1' ? adjacent(i,j,arr) : seeSeats(i,j,arr)
                if(val !== newVal){
                    changed++
                    newArr[i][j] = newVal
                }

            }
        }
    }
    return {'changed':changed,'seats':newArr}
}

let p1changed = 1
let p1Lines = structuredClone(lines)

while(p1changed !== 0){
    let next = seat(p1Lines,'p1');
    p1changed = next.changed;
    p1Lines = next.seats;
}

console.log(p1Lines.flat().filter((x)=>x==='#').length)

//Part 2

let p2changed = 1
let p2Lines = structuredClone(lines)

while(p2changed !== 0){
    let next = seat(p2Lines,'p2');
    p2changed = next.changed;
    p2Lines = next.seats;
}

console.log(p2Lines.flat().filter((x)=>x==='#').length)
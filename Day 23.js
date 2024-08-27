const fs = require('fs');
const input = fs.readFileSync('../day23input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/[\r\n]+/).map((x)=>x.trim())
console.log(lines)

let roomCol = lines[2].slice(1,-1).split('').map((x,ix)=> x === '#' ? x : ix).filter((x)=> x !== '#')
let roomAbove = 'abcd'
let amph = 'ABCD'

//console.log(roomCol)

let roomToHallway = {
    'a-L': [1,0],
    'a-R': [3,5,7,9,10],
    'b-L': [3,1,0],
    'b-R': [5,7,9,10],
    'c-L': [5,3,1,0],
    'c-R': [7,9,10],
    'd-L': [7,5,3,1,0],
    'd-R': [9,10]
}
let hallwayToRoom = {
    'a-2': [12,13],
    'b-4': [15,16],
    'c-6': [18,19],
    'd-8': [21,22]
}

let str = '..a.b.c.d..-BA-CD-BC-DA'
let roomsCanMove = Object.entries(hallwayToRoom).map(([k,v])=> [k,v.filter((x,ix,arr)=> (ix === 0 && str[x] !== '.' && (str[x] !== k.toUpperCase()||(str[x]===k.toUpperCase() && str[ix+1] !== k.toUpperCase()))) || (ix === 1 && str[x-1] === '.' && str[x] !== '.' && str[x] !== k.toUpperCase()))])

console.log(roomsCanMove)

Object.entries(roomToHallway).forEach(([k,v])=> {
    if (str[v[0]] === '.'){
        if(str[v[1]]=== '.'){

        }
    }
})



let strSplit = str.split('')

roomsCanMove.forEach(([room,vals])=>{
    console.log('room, vals',room,vals)
    let hallwayLR = Object.entries(roomToHallway).filter(([k,v])=> k.charAt(0) === room.charAt(0)).map((x)=>x[1].filter((h,hix,harr)=> str[h] === '.' && harr.slice(0,hix).every((v)=>!amph.includes(str[v]))))
    
    console.log(hallwayLR)
    // hallwayLR.forEach((dir)=>{
    //     for(i=0;i<dir.length;i++){
    //         if(str[dir[i]] === '.'){

    //         }
    //     }
    // })
})




let hallway = lines[1].slice(1,-1).split('').map((x,idx)=> roomCol.includes(idx) ? roomAbove[roomCol.indexOf(idx)] : x).join('')
console.log(hallway)

let hallwayIndexes = hallway.split('').map((x,idx)=> x === '.' ? idx : x).filter((y)=>typeof y === 'number')

console.log(hallwayIndexes)

let rooms1 = lines[2].split('').filter((x)=> x!=='#')
console.log(rooms1)
let rooms2 = lines[3].split('').filter((x)=> x!=='#')
console.log(rooms2)

for(i=0;i<rooms1.length;i++){
    hallway+=('-'+rooms1[i]+rooms2[i])
}

console.log(hallway)



let current_room = 'a'

//let moves = new RegExp(`([.]+${current_room}[.]*|[.]*${current_room}[.]+)`, "m")
//console.log(str.match(moves))

let roomMap = '..a.b.c.d..aAAbBBcCCdDD'

// if current room === a
//hallwayIndexes.slice(0,3) - check 1 must be '.' to go to 0 [ 0, 1, 3 ]
// room b = console.log(hallwayIndexes.slice(2,4)) [ 3, 5 ]
// room c = console.log(hallwayIndexes.slice(3,5)) [ 5, 7 ]
// room d = console.log(hallwayIndexes.slice(4)) [ 7, 9, 10 ]


// hallway - index before '-'
// rooms - each indexes after '-'
// needs to move char= char toUpperCase && either at bottom of home room, or top of home room next to itself on index+1
// Can move
//  - In room and either at top of room, or bottom of room next to '.' and there is a free '.' in the hallway
//  - In hallway and both of its home room are '..' or '.' followed by itself and there is clear run of '.' and no uppercase letters

function roomToHallway(){
    // curr room index = hallway char = index of char to lower case
    // get left of room index in hallway
    // get right of room index in hallway
    // slice hallway from room index out
}

function hallwayToRoom(){

}


// let hallway = lines[1].map((x,ix)=> x === '#'||roomCol.includes(ix)?x:ix).filter((x)=> x !== '#' && x !=='.')
// console.log(hallway)

let rowlen = lines.length
let collen = lines[0].length
let rooms = 'ABCD'
let gates = 'abcd'
 

let board = {}

for(i=0;i<rowlen;i++){
    for(j=0;j<collen;j++){
        let thisVal = lines[i][j]
        if(!'# '.includes(thisVal)){
            let nextVals

            if(thisVal === '.'){
                nextVals = [[i,j-1],[i,j+1],[i-1,j],[i+1,j]].filter(([r,c])=>0<= r && r < rowlen && 0 <= c && c < collen && lines[r][c] !== '#')
            } else {
                nextVals = [[i-1,j],[i+1,j]].filter(([r,c])=>0<= r && r < rowlen && 0 <= c && c < collen && lines[r][c] !== '#')
            }

            board[`${i}-${j}`] = {
                'value': thisVal,
                'nextVals': nextVals
            }
        }
    }
}

Object.entries(board).forEach(([k,v])=>console.log(v))

let toproom = Object.keys(board).filter((x)=>x.charAt(0)==='2')
let btmroom = Object.keys(board).filter((x)=>x.charAt(0)==='3')

console.log(toproom,btmroom)
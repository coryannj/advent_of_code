const fs = require('fs');
const input = fs.readFileSync('../day4input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\n/)
let draw = lines.shift().split(',')
let boards = lines.map((x)=>x.split(/[\r\n]+/).map((y)=>y.match(/\d+/g)))

function howManyDraws(rowOrCol){
    let drawIndex = draw.findIndex((x,ix,arr)=>rowOrCol.every((y)=>arr.slice(0,ix).includes(y)))
    return drawIndex !== -1 ? draw.slice(0,drawIndex):[]
}

let bingoIndex = 9999
let bingoDraw
let boardDetail

boards.forEach((board)=>{
    let cols = board.map((_, i, arr) => arr.map((v) => v[i]))

    board.forEach((row)=>{
        let bingo = howManyDraws(row)
        //console.log(row,bingo.length,bingo)
        if(bingo.length>0 && bingo.length<bingoIndex){
            bingoIndex = bingo.length
            bingoDraw = bingo
            boardDetail = board.flat()
        }
    })

    cols.forEach((col)=>{
        let bingoCol = howManyDraws(col)
        //console.log(col,bingoCol.length,bingoCol)
        if(bingoCol.length>0 && bingoCol.length<bingoIndex){
            bingoIndex = bingoCol.length
            bingoDraw = bingoCol
            boardDetail = board.flat()
        }
    })
})

console.log(boardDetail.filter((x)=> !bingoDraw.includes(x)).map(Number).reduce((acc,curr)=>acc+curr)* parseInt(bingoDraw.at(-1)))

let boardBingo = Array(boards.length).fill('.').map((_,i)=>{
    let bingoObj = {'lastBingoIndex': 9999,'lastBingoDraw':[],'lastBoardDetail':[]}
    return bingoObj
})

boards.forEach((board,bx)=>{
    let cols = board.map((_, i, arr) => arr.map((v) => v[i]))

    board.forEach((row)=>{
        let bingo = howManyDraws(row)
        //console.log(row,bingo.length,bingo)
        if(bingo.length>0 && bingo.length<boardBingo[bx]['lastBingoIndex']){
            boardBingo[bx]['lastBingoIndex'] = bingo.length
            boardBingo[bx]['lastBingoDraw'] = bingo
            boardBingo[bx]['lastBoardDetail'] = board.flat()
        }
    })

    cols.forEach((col)=>{
        let bingo = howManyDraws(col)
        //console.log(row,bingo.length,bingo)
        if(bingo.length>0 && bingo.length<boardBingo[bx]['lastBingoIndex']){
            boardBingo[bx]['lastBingoIndex'] = bingo.length
            boardBingo[bx]['lastBingoDraw'] = bingo
            boardBingo[bx]['lastBoardDetail'] = board.flat()
        }
    })
})

boardBingo.sort((a,b)=>a['lastBingoIndex']-b['lastBingoIndex'])

let lastBoard = boardBingo.at(-1)

console.log(lastBoard['lastBoardDetail'].filter((x)=> !lastBoard['lastBingoDraw'].includes(x)).map(Number).reduce((acc,curr)=>acc+curr)* parseInt(lastBoard['lastBingoDraw'].at(-1)))
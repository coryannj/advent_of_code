const fs = require('fs');
const input = fs.readFileSync('../day20input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\n/)

let alg = lines[0].split(/[\r\n]+/).join('')
let image = lines[1].split(/[\r\n]+/).map((x)=>x.split(''))
console.log(image.length)
console.log(image[0].length)

let offset = 200

let [minr,maxr,minc,maxc] = [0,image.length-1,0,image[0].length-1].map((x)=>x+offset)

let newminmax = [minr-1,maxr+1,minc-1,maxc+1]
let pixels = {}

image.forEach((row,rowind)=>{
    row.forEach((col,colind)=>{
        pixels[`${rowind+offset}-${colind+offset}`] = image[rowind][colind]
    })
})

function getChar([r,c],pixelObj,round){
    let toBinary = [[r-1,c-1],[r-1,c],[r-1,c+1],[r,c-1],[r,c],[r,c+1],[r+1,c-1],[r+1,c],[r+1,c+1]].map(([nr,nc])=>{
        if(pixelObj[`${nr}-${nc}`]===undefined){
            return round%2===1 ?'0':'1'
        } else {
            return pixelObj[`${nr}-${nc}`] === '.' ? '0' : '1'
        }
    })
    return alg[parseInt(toBinary.join(''),2)]
}

function newImage(minmax,pixelObj,round){
    let [minrow,maxrow,mincol,maxcol] = minmax
    let newObj = {}
    for(i=minrow;i<=maxrow;i++){
        for(j=mincol;j<=maxcol;j++){
            newObj[`${i}-${j}`] = getChar([i,j],pixelObj,round)
        }
    }
    return [[minrow-1,maxrow+1,mincol-1,maxcol+1],newObj]
}

let once = newImage(newminmax,pixels,1)
let twice = newImage(once[0],once[1],2)
console.log(Object.values(twice[1]).filter((x)=>x === '#').length) // Part 1 answer

// Part 2
let rounds = 50
let counter = 1

while(counter<=rounds){
    let next = newImage(newminmax,pixels,counter)
    newminmax = next[0]
    pixels = next[1]
    counter++
}

console.log(Object.values(pixels).filter((x)=>x === '#').length) // Part 2 answer
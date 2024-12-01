const fs = require('fs');
const input = fs.readFileSync('../day3input.txt',{ encoding: 'utf8', flag: 'r' });

let rows = input.replaceAll(/[.]/g,'x').split(/[\r\n]+/) // replace '.' with 'x' to simplify the regex
const numberRegex = /\d+/g;
const gearRegex = /[\W]/g;
let numberMap = [], gearMap = []

//Part 1
let p1sum = 0;

// Map [row, colStart, colEnd, val] of each number, [row, col,val ] of each gear 
rows.forEach((row,rowIdx)=>{
    var numbers = [...row.matchAll(numberRegex)]
    var gears = [...row.matchAll(gearRegex)]

    numbers.forEach((number)=> {        
        numberMap.push([rowIdx,number.index,number.index+number[0].length-1,parseInt(number[0])])
    })

    gears.forEach((gear)=> {
        gearMap.push([rowIdx,gear.index,gear[0]])
    })
})

// Check if col indexes overlap between gear and numbers above/below/sides
function getAdjacent(gearCoord) {
    let [r,c] = gearCoord
    let adjacent = numberMap.filter(([rowInd,colStart,colEnd,val])=>{
        return ((rowInd === r-1 || rowInd === r+1) && colStart <= c+1 && c-1 <= colEnd) // Row above/below gear
        || (rowInd === r && (colEnd === c-1 || colStart === c+1)) // Same row as gear
    })
    return adjacent
}

// Loop through each gear, get adjacent numbers and add to total
gearMap.forEach((gear)=> {
    p1sum += getAdjacent(gear).map((x)=> x[3]).reduce((acc,curr)=> acc+curr)
})

console.log(p1sum) // Part 1 answer

//Part 2
let p2sum = 0

// Filter gears to '*' only, loop, if only 2 numbers touching then multiply and add to total
gearMap.filter((el)=> el[2] === '*').forEach((gear)=> {
    let adjacent = getAdjacent(gear)
    if (adjacent.length === 2) {
        p2sum += adjacent.map((x)=> x[3]).reduce((acc,curr)=> acc*curr)
    }
})

console.log(p2sum) // Part 2 answer
const fs = require('fs');
const inputload = fs.readFileSync('../day3input.txt',{ encoding: 'utf8', flag: 'r' });

//Part 1

// Replace all full stops with letter x to make regex easier bc i'm lazy
var replaceregex = /[.]/g;
let inputreplace = inputload.replaceAll(replaceregex,'x')

// Add one char to beginning and end of each line to avoid need for boundary checking
const input = inputreplace.split(/[\r\n]+/).map((x) => {
    let padding = 'x'
    return padding.concat(x,padding)
})

// Add one line to beginning and end of array to avoid need for boundary checking
input.push('x'.repeat(142))
input.unshift('x'.repeat(142))

// Regex to find items with symbols left or right, and without symbols left or right
const rightleftregex = /(?<=\W)\d+|\d+(?=\W)/gm
const norightleftregex = /(?<=x)\d+(?=x)/g // must have an 'x' on both sides
const symbolregex = /\W/g

// Sum of items with symbols on right or left
let leftrightsum = input
.map((x) => {
    let items = x.match(rightleftregex)
    return items === null ? 0 : items.map((x) => parseInt(x)).reduce((acc,curr) => acc + curr,0)
}).reduce((acc,curr) => acc + curr,0)
console.log(leftrightsum)

// Sum of items with symbols above or below
let abovebelowsum = input
.map((x,index) => {
    if (x.match(norightleftregex) === null) {
        return 0
    } else {
        // Get all items in string we want to search for symbols above/below
        let items = x.match(norightleftregex)
        let searchstartindex = 0
        let rowsum = 0
        // Loop through each item and check if valid
        for (item of items) {
            let substring = x.substring(searchstartindex) // gets substring from end of prev match
            let padding = 'x'
            let numstring = padding.concat(item,padding) // adds 'x' before/after item to avoid left/right symbols and to set correct search indexes for diagonal symbols e.g. '123' => 'x123x'
            let findindex = substring.search(numstring) // index of our item string
            let numlength = numstring.length // length of our item string

            // Gets strings above/below and checks for symbols, then adds item to rowsum if found
            let stringabove = input[index-1].substring(searchstartindex+findindex,searchstartindex+findindex+numlength).match(symbolregex)
            let stringbelow = input[index+1].substring(searchstartindex+findindex,searchstartindex+findindex+numlength).match(symbolregex)
            if (stringabove !== null || stringbelow !== null) {
                rowsum = rowsum+parseInt(item)
            }
            searchstartindex = searchstartindex + findindex + numlength -1 // starts next search from after this one
        }
        return rowsum // total of valid items in row
    }
}).reduce((acc,curr) => acc + curr,0)
console.log(abovebelowsum)

// Part 1 answer
console.log(leftrightsum+abovebelowsum)

//Part 2

// Replace all * with letter y to make regex/stringops easier bc i'm lazy
var replaceregex = /[*]/g;
let gearreplace = inputload.replaceAll(replaceregex,'y')

// Add one char to beginning and end of each line to avoid need for boundary checking
const inputgear = gearreplace.split(/[\r\n]+/).map((x) => {
    let padding = 'x'
    return padding.concat(x,padding)
})

// Add one line to beginning and end of array to avoid need for boundary checking
inputgear.push('x'.repeat(142))
inputgear.unshift('x'.repeat(142))

// Regex for gears
gearregex = /[y]/g

// function to check surrounding chars for items
function checksurrounding(rowindex,gearindex){
    let sides = ['center','left','right']
    let rows = ['same','top','btm']
    let touchingarray = []

    for (side of sides) {
        var sideindextocheck = side === 'center' ? gearindex : side === 'left' ? gearindex-1 : gearindex+1
        for (row of rows) {
            var rowindextocheck = row === 'same' ? rowindex : row === 'top' ? rowindex-1 : rowindex+1
            if (isNaN(inputgear[rowindextocheck][sideindextocheck]) === false) {
                touchingarray.push(side.concat(row))
            }
        }
    }
    return touchingarray
}

// function to get correct count of surrounding numbers
function touchingcount(array) {
    let touchcounter = 0
    let countarray = array

    if (countarray.includes('centertop') === true) {
        touchcounter++
    } else if (countarray.includes('lefttop')&&countarray.includes('righttop')){
        touchcounter = touchcounter+2
    } else if (countarray.includes('lefttop')||countarray.includes('righttop')) {
        touchcounter++
    }

    if (countarray.includes('centerbtm') === true) {
        touchcounter++
    } else if (countarray.includes('leftbtm')&&countarray.includes('rightbtm')){
        touchcounter = touchcounter+2
    } else if (countarray.includes('leftbtm')||countarray.includes('rightbtm')) {
        touchcounter++
    }

    if (countarray.includes('leftsame') === true) {
        touchcounter++
    }


    if (countarray.includes('rightsame') === true) {
        touchcounter++
    }


    return touchcounter
}

// function to get surrounding numbers
function getRatio(rowindex,gearindex,...array) {
    let toparray = []
    let samearray = []
    let btmarray = []

    let toucharray = array.flat()
    
    for (item of toucharray) {
        let indstart = 1
        let rowindextocheck = item.includes('same') ? rowindex : item.includes('top') ? rowindex-1 : rowindex+1

        if (item === 'centertop') {
            toparray.push(inputgear[rowindextocheck][gearindex])
        } else if (item === 'centerbtm') {
            btmarray.push(inputgear[rowindextocheck][gearindex])
        } else {
            let itemarray = []
            if (item.includes('left')) {
                while (isNaN(inputgear[rowindextocheck][gearindex-indstart]) === false) {
                    itemarray.unshift(inputgear[rowindextocheck][gearindex-indstart])
                    indstart++
                }
                item.includes('top') ? toparray.unshift(itemarray.join('')) : item.includes('btm') ? btmarray.unshift(itemarray.join('')) : samearray.unshift(itemarray.join(''))
            }
            if (item.includes('right')) {
                while (isNaN(inputgear[rowindextocheck][gearindex+indstart]) === false) {
                    itemarray.push(inputgear[rowindextocheck][gearindex+indstart])
                    indstart++
                }
                item.includes('top') ? toparray.push(itemarray.join('')) : item.includes('btm') ? btmarray.push(itemarray.join('')) : samearray.push(itemarray.join(''))
            }

        }

    }

    let resultarray = []

    if (toparray.length > 0) {
        if (toucharray.includes('centertop') === true) {
            resultarray.push(toparray.join(''))
        } else {
            resultarray.push(toparray)
        }
    }

    if (btmarray.length > 0) {
        if (toucharray.includes('centerbtm') === true) {
            resultarray.push(btmarray.join(''))
        } else {
            resultarray.push(btmarray)
        }
    }

    if (samearray.length>0) {
        resultarray.push(samearray)
    }

    return resultarray.flat().map((x) => parseInt(x)).reduce((y,z) => y*z,1)
}




// Sum of gears
let totalsum=0
for ([index,val] of inputgear.entries()) {
    if (val.match(gearregex) !== null) {

        // Get all gears in string
        let items = val.match(gearregex)
        let searchstartindex = 0
        let rowsum = 0
        // Loop through each item and check for numbers
        for (item of items) {
            let substring = val.substring(searchstartindex) // gets substring from end of prev match
            let findindex = substring.search(item) 
            let touching = checksurrounding(index,searchstartindex+findindex)
            let touchnumcount = touchingcount(touching)
            if (touchnumcount === 2) {
                let gearsum = getRatio(index,searchstartindex+findindex,touching)
                rowsum = rowsum+gearsum
            }
            searchstartindex = searchstartindex + findindex + 1 // starts next search from after this one
        }
        
        totalsum = totalsum+rowsum
    }
}
console.log(totalsum)


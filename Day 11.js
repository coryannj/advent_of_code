let p1serial = 6303

function power([x,y],serial){
    let rackId = x+10
    let initialPower = ((rackId*y)+serial)*rackId
    let hundreds = initialPower>=100? parseInt(initialPower.toString().split('').at(-3)):0

    return hundreds-5
}

function square(r,c,size){
    return grid.slice(r,r+size).flatMap((x,ix)=>x.slice(c,c+size)).reduce((acc,curr)=>acc+curr)
}

let row = Array(300).fill('.').map((x,ix)=>ix+1)
let grid = Array(300).fill('.').map((y,yx)=>row.map((x)=>power([x,yx+1],p1serial)))

let rows = 300
let cols = 300

function findMax(size){

    let currMax = 0
    let maxCoord

    for(i=0;i<=rows-size;i++){
        for(j=0;j<=cols-size;j++){
            let thisMax = square(i,j,size)
            if(thisMax>currMax){
                currMax = thisMax
                maxCoord = [j+1,i+1]
            }
        }
    
    }

    return [currMax,maxCoord]
}

let p1Max = findMax(3)
console.log(p1Max[1].join(',')) // Part 1 answer

// Part 2
let p2Max = p1Max[0]

let p2result

let isPositive = true
let p2size = 4

while(isPositive){
    let nextSize = findMax(p2size)

    if(nextSize[0]>=p2Max){
        p2Max = nextSize[0]
        p2result = nextSize.concat(p2size)
    }

    if(nextSize[0]>0){
        p2size++
    } else {
        break
    }
   
}

console.log(p2result[1].concat(p2result[2]).join(',')) // Part 2 answer
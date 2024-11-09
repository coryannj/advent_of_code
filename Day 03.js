let input = 277678

// Part 1
let root = Math.sqrt(input)
let squares = Array(Math.ceil(root)+1).fill('.').map((x,ix)=>ix*ix)
let rings = squares.filter((x,ix)=>ix%2===1).length-1
let [r,c] = [rings,rings]

if(input>squares.at(-1)){
    r-=(Math.abs(input-squares.at(-1)))
} else if (input<squares.at(-1)) {
    c-=(Math.abs(input-squares.at(-1)))
}

console.log(r+c)

// Part 2
let spiral = {'0|0':1}
let seen = [[0,0]]
let last = 1
let next = [0,0,'R']

while (last<input){
    let [r,c,dir] = next

    let nextObj = {
        'R':[r,c+1],
        'L':[r,c-1],
        'U':[r-1,c],
        'D':[r+1,c]
    }

    let [nr,nc] = nextObj[dir]
    
    let adjacentKeys = [[nr-1,nc-1],[nr-1,nc],[nr-1,nc+1],[nr,nc+1],[nr+1,nc+1],[nr+1,nc],[nr+1,nc-1],[nr,nc-1]].map((x)=>x.join('|'))

    let adjacent = Object.entries(spiral).filter(([k,v])=>adjacentKeys.includes(k)).map((x)=>x[1]).reduce((acc,curr)=>acc+curr,0)
    
    let nextdir

    if(seen.findIndex(([sr,sc])=>sr === nr) !== -1 && seen.findIndex(([sr,sc])=>sc === nc) !== -1){
        nextdir = dir
    } else {
        if (seen.findIndex(([sr,sc])=>sc === nc) === -1){
            if(dir === 'R'){
                nextdir = 'U'
            } else {
                nextdir = 'D'
            }
        } 
        
        if (seen.findIndex(([sr,sc])=>sr === nr) === -1){
            if(dir === 'U'){
                nextdir = 'L'
            } else {
                nextdir = 'R'
            }
           
        }
    }
    
    spiral[`${nr}|${nc}`] = adjacent;
    last = adjacent;
    next = [nr,nc,nextdir];
    seen.push([nr,nc]);
}

console.log(last)


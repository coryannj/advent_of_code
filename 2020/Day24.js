const fs = require('fs');
const input = fs.readFileSync('../day24input.txt',{ encoding: 'utf8', flag: 'r' });

const hexRegex = /(se|sw|nw|ne)|(?!n|s)(e|w)/gm

const dirLookup = (q,r,s) => { 
    return {
        'e':[q+1,r,s-1],
        'w':[q-1,r,s+1],
        'ne':[q+1,r-1,s],
        'nw':[q,r-1,s+1],
        'se':[q,r+1,s-1],
        'sw':[q-1,r+1,s]
    }
}

let lines = input.split(/[\r\n]+/).map((x)=>x.match(hexRegex))


// Part 1 
let tiles = {'0|0|0':'white'}

lines.forEach((directions)=>{
    let currTile = '0|0|0'
    let dirs = directions.slice()

    while(dirs.length>0){
        let direction = dirs.shift()
        let [q,r,s] = currTile.split('|').map(Number) 

        let dLookup = {
            'e':[q+1,r,s-1],
            'w':[q-1,r,s+1],
            'ne':[q+1,r-1,s],
            'nw':[q,r-1,s+1],
            'se':[q,r+1,s-1],
            'sw':[q-1,r+1,s]
        }

        let nextTile = dLookup[direction]
        let nextKey = nextTile.join('|')
        currTile = nextKey
    }

    if(tiles[currTile]=== undefined){
        tiles[currTile] = 'black'
    } else {
        tiles[currTile] = tiles[currTile]==='black'?'white':'black'
    }
})

console.log(Object.values(tiles).filter((x)=>x==='black').length) // Part 1 answer

// Part 2
for(i=100;i>0;i--){
    Object.keys(tiles).forEach((k)=>{
        let [q,r,s] = k.split('|').map(Number)
        let updateMap = Object.values(dirLookup(q,r,s)).filter((x)=>tiles[x.join('|')]===undefined)
        updateMap.forEach((nk)=>{
            let [nq,nr,ns] = nk
            tiles[nk.join('|')]='white'
        })
    })

    Object.entries(tiles).filter(([k,v])=>{
        let [q,r,s] = k.split('|').map(Number)
        let blackCount = Object.values(dirLookup(q,r,s)).map((x)=>tiles[x.join('|')]).filter((x)=>x==='black').length
        
        return (v === 'black' && (blackCount === 0 || blackCount>2)) || (v !== 'black' && blackCount === 2)
    }).forEach(([nk,nv])=> tiles[nk]==='black' ? tiles[nk]='white':tiles[nk]='black')

}

console.log(Object.values(tiles).filter((x)=>x==='black').length) // Part 2 answer
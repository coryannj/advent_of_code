const fs = require('fs');
const input = fs.readFileSync('../day17input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(''))

const neighbours = (x,y,z) => { 
    return [
    [x+1,y,z],[x+1,y+1,z],[x+1,y,z+1],[x,y+1,z],[x,y+1,z+1],[x,y,z+1],
    [x-1,y,z],[x-1,y-1,z],[x-1,y,z-1],[x,y-1,z],[x,y-1,z-1],[x,y,z-1],
    [x+1,y-1,z],[x+1,y,z-1],[x,y+1,z-1],
    [x-1,y+1,z],[x-1,y,z+1],[x,y-1,z+1],
    [x+1,y+1,z+1],[x-1,y+1,z+1],[x+1,y-1,z+1],[x+1,y+1,z-1],
    [x-1,y-1,z-1],[x+1,y-1,z-1],[x-1,y+1,z-1],[x-1,y-1,z+1]
]
}

let cubes = {}
let p2cubes = {}

lines.forEach((line,yind)=>{
    line.forEach((cube,xind)=>{
        cubes[`${xind}|${yind}|0`] = cube
        p2cubes[`${xind}|${yind}|0|0`] = cube
    })
})

// Part 1 

for(i=6;i>0;i--){
    Object.keys(cubes).forEach((k)=>{
        let [x,y,z] = k.split('|').map(Number)
        let updateMap = Object.values(neighbours(x,y,z)).filter((x)=>cubes[x.join('|')]===undefined)
        updateMap.forEach((nk)=>{
            //let [nq,nr,ns] = nk
            cubes[nk.join('|')]='.'
        })
    })

    Object.entries(cubes).filter(([k,v])=>{
        let [x,y,z] = k.split('|').map(Number)
        let activeCount = Object.values(neighbours(x,y,z)).map((x)=>cubes[x.join('|')]).filter((x)=>x==='#').length
        
        return (v === '#' && (activeCount <2 || activeCount > 3)) || (v !== '#' && activeCount === 3)
    }).forEach(([nk,nv])=> cubes[nk]==='#' ? cubes[nk]='.':cubes[nk]='#')

}

console.log(Object.values(cubes).filter((x)=>x==='#').length) // Part 1 answer

// Part 2
const p2neighbours = (x,y,z,w) =>{
    let cycle = [-1,0,+1]
    let result = []

    cycle.map((el)=>el+x).forEach((elx)=>{
        cycle.map((el)=>el+y).forEach((ely)=>{
            cycle.map((el)=>el+z).forEach((elz)=>{
                cycle.map((el)=>el+w).forEach((elw)=>{
                    if([elx,ely,elz,elw].join('') !== [x,y,z,w].join('')){
                        result.push([elx,ely,elz,elw])
                    }
                    
                })
            })
        })
    })

    return result
}

for(i=6;i>0;i--){
    Object.keys(p2cubes).forEach((k)=>{
        let [x,y,z,w] = k.split('|').map(Number)
        let updateMap = [...p2neighbours(x,y,z,w)].filter((elx)=>p2cubes[elx.join('|')]===undefined)
        updateMap.forEach((nk)=>{
            //let [nq,nr,ns] = nk
            p2cubes[nk.join('|')]='.'
        })
    })

    Object.entries(p2cubes).filter(([k,v])=>{
        let [x,y,z,w] = k.split('|').map(Number)
        let activeCount = [...p2neighbours(x,y,z,w)].map((elx)=>p2cubes[elx.join('|')]).filter((elx)=>elx==='#').length
        
        return (v === '#' && (activeCount <2 || activeCount > 3)) || (v !== '#' && activeCount === 3)
    }).forEach(([nk,nv])=> p2cubes[nk]==='#' ? p2cubes[nk]='.':p2cubes[nk]='#')

}

console.log(Object.values(p2cubes).filter((x)=>x==='#').length) // Part 2 answer
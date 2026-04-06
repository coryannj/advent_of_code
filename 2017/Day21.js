const fs = require('fs');
require('../inputs/utils.js');
const input = fs.readFileSync('../inputs/2017/day21.txt', {encoding: "utf8", flag: "r", });

let lines = input.split(/\n/g).map((x)=>x.split(' => ').map((y,yi)=>yi === 0 ? y.replaceAll('/','') : y.split('/')))

const rotations = (g) => {
    let len = Math.sqrt(g.length)
    g = g.chunks(len)
    let flipx = g.map((x)=>x.toReversed())
    let flipy = g.toReversed()
    let flipxy = flipy.map((x)=>x.toReversed())

    let r = g[0].map((x,i)=>g.map((y)=>y[i]))
    let rflipx = r.map((x)=>x.toReversed())
    let rflipy = r.toReversed()
    let rflipxy = rflipy.map((x)=>x.toReversed())

    return [g,flipx,flipy,flipxy,r,rflipx,rflipy,rflipxy].map((x)=>x.flat())
}

const m2 = rotations([0,1,2,3])
const m3 = rotations([0,1,2,3,4,5,6,7,8])

let rules = Object.fromEntries(lines.flatMap(([k,v])=> [...new Set((k.length === 4 ? m2 : m3).map((x)=>x.map((y)=>k[y]).join('')))].map((nk)=>[nk,v]))) // Rotates and flips all the rules

const solve = (iterations) => {
    const partition = (g) => {
        if(g.length%2 === 1 && g[0].length%2 === 1) return g.map((x)=>x.join('')) // Grid is not even, leave 3x3 subgrids as is      

        return g
                .chunks(Math.sqrt(g.length)) // divides subgrids into rows
                .flatMap((x)=>x[0].map((y,yi)=>x.map((z)=>z[yi]).join('').split('').chunks(2).map((y)=>y.join('')))) // Pieces together the rows from each subgrid, then chunks into groups of 2 to prep for the 2x2 splitting e.g. '##','.#','..'
                .chunks(2) // Chunks rows into groups of 2
                .flatMap((x)=> x[0].map((y,i)=>x.map((z)=>z[i]).join(''))) // Zips each pair of chars to get the 2x2
    }

    let grid = ['.#...####']

    while(iterations--){
        grid = partition(grid.map((x)=>rules[x]))
    }

    return grid.join('').replaceAll('.','').length

}

console.log(solve(5))
console.log(solve(18))
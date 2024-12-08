const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('./inputs/2024/day8.txt', {encoding: "utf8", flag: "r", });

const grid = input.lines().mk2d()
let rowlen = grid.length
let collen = grid[0].length

let antennas = {}

for(i=0;i<rowlen;i++){
    for(j=0;j<collen;j++){
        if(grid[i][j] !== '.'){
            if(!antennas[grid[i][j]]){
                antennas[grid[i][j]]=[]
            }
            antennas[grid[i][j]].push([i,j])
        }
    }
}

let p1 = new Set()
let p2 = new Set()

for(const[k,v] of Object.entries(antennas)){
    while(v.length>1){
        let [r1,c1] = v.shift()
        p2.add(`${r1}_${c1}`);

        for(l=0;l<v.length;l++){
            let [r2,c2] = v[l];
            p2.add(`${r2}_${c2}`);
            let [rdiff,cdiff] = [r1-r2,c1-c2];
            let steps = 1;

            while(true){
                let changed = 0
                let [nr1,nc1] = [r1+(rdiff*steps),c1+(cdiff*steps)]
                let [nr2,nc2] = [r2-(rdiff*steps),c2-(cdiff*steps)]

                if(0 <= nr1 && nr1 < rowlen && 0 <= nc1 && nc1 < collen){
                    if(steps === 1) p1.add(`${nr1}_${nc1}`)
                    p2.add(`${nr1}_${nc1}`)
                    changed++
                }

                if(0 <= nr2 && nr2 < rowlen && 0 <= nc2 && nc2 < collen){
                    if(steps === 1 ) p1.add(`${nr2}_${nc2}`)
                    p2.add(`${nr2}_${nc2}`)
                    changed++
                }
                if(changed === 0) break;
                steps++
            }
        }
    }
}

console.log('P1 answer is ',p1.size,' P2 answer is ',p2.size)
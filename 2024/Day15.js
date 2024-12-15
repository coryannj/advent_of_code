const fs = require("fs");
require("../utils.js");
const { shoelace, md5, gcd, lcm, nextArr, nextArr8 } = require("../utils.js");
const input1 = fs.readFileSync('../inputs/2024/day15.txt', {encoding: "utf8", flag: "r", });

const solve = (input,partNo) => {
    if(partNo === 2) input = input.replaceAll('#','##').replaceAll('O','[]').replaceAll('.','..').replaceAll('@','@.')
    
    let [grid,movements] = input.lines(2);
    grid = grid.lines().mk2d();
    movements = movements.lines().mk2d().flat();
    let startR = grid.findIndex((x)=>x.includes('@'));
    let startC = grid[startR].indexOf('@');
    let rowLen = grid.length;
    let colLen = grid[0].length;
    let pos = [startR,startC];

    while(movements.length>0){
        let [r,c] = pos
        let dir = movements.shift()
        
        let dirs = '^>v<'
        let nextStep = nextArr([r,c],0,grid)
        let dirIdx = dirs.indexOf(dir)
        let nextVal = grid[nextStep[dirIdx][0]][nextStep[dirIdx][1]]

        if(nextVal==='#'){
            continue;
        }
    
        if(nextVal === '.'){
            grid[r][c] = '.'
            pos = [r,c] = nextStep[dirIdx]
            grid[r][c] = '@'
            continue;
        }
        // Robot is next to a box
        let nr = r
        let nc = c

        // Rotate/reverse 2d array (yes it's gross, no I'm not going to change it :-D)
        if(dir === '^'|| dir === 'v'){
            grid = grid[0].map((col, i) => grid.map(row => row[i]));
            r = nc
            if(dir === 'v') c = nr
        }

        if(dir === '<'||dir === '^'){
            grid.forEach((x)=>x.reverse())

            c = dir === '<' ? colLen-1-nc : rowLen-1-nr
        }

        if(partNo === 1 || (partNo === 2 && (dir === '<' || dir === '>'))){
            let spaceIndex = grid[r].indexOf('.',c);
            let wallIndex = grid[r].indexOf('#',c);
            
            if(spaceIndex !== -1 && (wallIndex === -1 || wallIndex>spaceIndex)){
                let toReplace = ['.'].concat(grid[r].slice(c,spaceIndex));
                let spliceLen = toReplace.length;
                grid[r].splice(c,spliceLen,...toReplace);
                pos = [r,c] = nextStep[dirIdx];
            }

        } else {
            let moveMap = new Map();
            moveMap.set(r,[[r,c,'@'],[r,c+1,grid[r][c+1]]]);

            let queue = [...moveMap.values().map((x)=>x.at(-1)).filter((x)=>x[2] === '[' || x[2] ===']')];

            while(queue.length>0){
                queue.forEach(([r,c,v])=>{
                    if(v === '['){
                        moveMap.get(r).push([r,c+1,grid[r][c+1]]);

                        if(!moveMap.has(r+1)) moveMap.set(r+1,[]);
                        
                        moveMap.get(r+1).push([r+1,c,']']);
                        moveMap.get(r+1).push([r+1,c+1,grid[r+1][c+1]]);
                    }
                    if(v === ']'){
                        moveMap.get(r).push([r,c+1,grid[r][c+1]]);

                        if(!moveMap.has(r-1)) moveMap.set(r-1,[]);

                        moveMap.get(r-1).push([r-1,c,'[']);
                        moveMap.get(r-1).push([r-1,c+1,grid[r-1][c+1]]);
                    }
                })

                queue = [...moveMap.values().map((x)=>x.at(-1))]

                if(queue.some((x)=>x[2] === '#')) break;

                queue = queue.filter((x)=>x[2] === '[' || x[2] ===']')
            }

            if([...moveMap.values().map((x)=>x.at(-1)[2])].every((x)=>x==='.')){
                let moveKeys = [...moveMap.keys()]

                moveKeys.forEach((mKey)=>{
                    let moveRow = moveMap.get(mKey);

                    while(moveRow.length>0){
                        let [nr,nc,nv] = moveRow.pop();
                        let newVal = moveRow.length>0 ? moveRow.at(-1)[2] : '.';
                        grid[nr][nc] = newVal;
                    }
                })
                pos = [r,c] = nextStep[dirIdx];
                
            }
        }

        // Restore grid for next iteration
        if(dir === '<' || dir === '^') grid.forEach((x)=>x.reverse());
        if(dir === '^'|| dir === 'v') grid = grid[0].map((col, i) => grid.map(row => row[i]));;
    }

    return partNo === 1 ? grid.flatMap((x,ix)=>x.flatMap((y,yx)=> y==='O'? [(100*ix)+yx]:[])).sum() : grid.flatMap((x,ix)=>x.flatMap((y,yx)=> y==='['? [(100*ix)+yx]:[])).sum()
}

console.log(solve(input1,1))
console.log(solve(input1,2))
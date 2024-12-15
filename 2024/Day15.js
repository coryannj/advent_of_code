const fs = require("fs");
require("../utils.js");
const { shoelace, md5, gcd, lcm, nextArr, nextArr8 } = require("../utils.js");
const input1 = fs.readFileSync('../inputs/2024/day15.txt', {encoding: "utf8", flag: "r", });

// Gross version with matrix transformations
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

        // Rotate/reverse 2d array
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

let t0 = performance.now()
let s1p1 = solve(input1,1)
let t1 = performance.now()
let s1p2 = solve(input1,2)
let t2 = performance.now()


console.log('Part 1 - Matrix transformations - answer: ',s1p1,' ',t1-t0,'ms')
console.log('Part 2 - Matrix transformations - answer: ',s1p2,' ',t2-t1,'ms')

// Less gross version
const solve2 = (input,partNo) => {
    if(partNo === 2) input = input.replaceAll('#','##').replaceAll('O','[]').replaceAll('.','..').replaceAll('@','@.')
    
    let [grid,movements] = input.lines(2);
    grid = grid.lines().mk2d();
    movements = movements.lines().mk2d().flat();
    let startR = grid.findIndex((x)=>x.includes('@'));
    let startC = grid[startR].indexOf('@');
    let pos = [startR,startC];

    const nextDir = ([sr,sc],direction) => {
        let dirObj = {
        '^':[sr-1,sc,grid[sr-1][sc]],
        '>':[sr,sc+1,grid[sr][sc+1]],
        'v':[sr+1,sc,grid[sr+1][sc]],
        '<':[sr,sc-1,grid[sr][sc-1]]
        }

        return dirObj[direction]
    }
    
    while(movements.length>0){
        let [r,c] = pos;
        let dir = movements.shift();
        let nextStep = [nextRow,nextCol,nextVal] = nextDir([r,c],dir);

        if(nextVal==='#'){
            continue;
        }
    
        if(nextVal === '.'){
            grid[r][c] = '.';
            pos = [r,c] = [nextRow,nextCol];
            grid[r][c] = '@';
            continue;
        }
        
        // Robot is next to a box
        let next = [pos.concat('@'),nextStep]

        if(partNo === 1 || (partNo === 2 && (dir === '<' || dir === '>'))){
            while('O[]'.includes(next.at(-1)[2])){
                next.push(nextDir(next.at(-1).slice(0,2),dir));
            }

            if(next.at(-1)[2] !== '#'){
                while(next.length>0){
                    let [tr,tc,tv] = next.pop();
                    let newVal = next.length>0 ? next.at(-1)[2] : '.';
                    grid[tr][tc] = newVal;
                }
                pos = [r,c] = [nextRow,nextCol]
            }
        } else {
            let moveMap = new Map();
            moveMap.set(c,next);
            let queue = [...moveMap.values().map((x)=>x.at(-1)).filter((x)=>x[2] === '[' || x[2] ===']')];

            while(queue.length>0){
                queue.forEach(([qr,qc,qv])=>{
                    if(qv === '['){
                        moveMap.get(qc).push(nextDir([qr,qc],dir));

                        if(!moveMap.has(qc+1)) moveMap.set(qc+1,[]);
                        
                        moveMap.get(qc+1).push([qr,qc+1,']']);
                        moveMap.get(qc+1).push(nextDir([qr,qc+1],dir));
                    }
                    if(qv === ']'){
                        moveMap.get(qc).push(nextDir([qr,qc],dir));

                        if(!moveMap.has(qc-1)) moveMap.set(qc-1,[]);

                        moveMap.get(qc-1).push([qr,qc-1,'[']);
                        moveMap.get(qc-1).push(nextDir([qr,qc-1],dir));
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
                pos = [r,c] = [nextRow,nextCol]                
            }
        }
    }

    return partNo === 1 ? grid.flatMap((x,ix)=>x.flatMap((y,yx)=> y==='O'? [(100*ix)+yx]:[])).sum() : grid.flatMap((x,ix)=>x.flatMap((y,yx)=> y==='['? [(100*ix)+yx]:[])).sum()
}

let t3 = performance.now()
let s2p1 = solve2(input1,1)
let t4 = performance.now()
let s2p2 = solve2(input1,2)
let t5 = performance.now()


console.log('Part 1 - No matrix transformations - answer: ',s2p1,' ',t4-t3,'ms')
console.log('Part 2 - No matrix transformations - answer: ',s2p2,' ',t5-t4,'ms')
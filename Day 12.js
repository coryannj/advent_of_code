const fs = require('fs');
const input = fs.readFileSync('../day12input.txt',{ encoding: 'utf8', flag: 'r' });

let elevation = 'SabcdefghijklmnopqrstuvwxyzE'

const lines = input.split(/[\r\n]+/).map((x)=> x.split('').map((y)=> elevation.indexOf(y)))

let rowlen = lines.length
let collen = lines[0].length

let startrow = lines.findIndex((x)=> x.includes(0))
let startcol = lines[startrow].findIndex((x)=> x === 0)
let endrow = lines.findIndex((x)=> x.includes(27))
let endcol = lines[endrow].findIndex((x)=> x === 27)

function bfs(startx,starty,endx,endy,p1orp2){
    let seen = new Set();
    let queue = [[-1,[startx,starty]]];
    let allPaths=[];

    while(allPaths.length === 0 && queue.length>0){
        let next = queue.shift();
        let [lastx,lasty] = next.at(-1);

        let nextArr = [[lastx,lasty+1],[lastx,lasty-1],[lastx+1,lasty],[lastx-1,lasty]].filter(([rowind,colind])=> 
            !seen.has(`${rowind}_${colind}`) 
            && 0 <= rowind && rowind<rowlen 
            && 0<= colind && colind<collen 
            && ((startx === startrow && starty === startcol && lines[rowind][colind]<= lines[lastx][lasty]+1)||(startx === endrow && starty === endcol && lines[rowind][colind]>= lines[lastx][lasty]-1))
        )

        nextArr.forEach(([nextrow,nextcol])=>{
            let toNext = next.slice(0)
            toNext.push([nextrow,nextcol])
            if (p1orp2 === 'p1' && nextrow === endx && nextcol === endy || p1orp2 === 'p2' && lines[nextrow][nextcol] === 1){
                //console.log('end is found, path is ',toNext) // for test input - take length of points, some weird off by 2 error
                allPaths.push(toNext)
            } else {
                toNext[0]++
                seen.add(`${nextrow}_${nextcol}`)
                    queue.push(toNext);
            }
        })
    }
  return allPaths[0][0]
}

console.log(bfs(startrow,startcol,endrow,endcol,'p1')) // Part 1 answer
console.log(bfs(endrow,endcol,startrow,startcol,'p2')) // Part 2 answer
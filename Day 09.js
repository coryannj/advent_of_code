const fs = require('fs');
const input = fs.readFileSync('../day9input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>{
    let split = x.split(' ')
    return [split[0],parseInt(split[1])]
})

let p1next = [[10000,10000],[10000,10000]]
let p1Seen = new Set()

let p2next = [[10000,10000],[10000,10000],[10000,10000],[10000,10000],[10000,10000],[10000,10000],[10000,10000],[10000,10000],[10000,10000],[10000,10000]]
let p2Seen = new Set()

function getNextStep(headx,heady,tailx,taily){
    let nextArr=[[headx,heady]]

    if(tailx-1 <= headx && headx <= tailx+1 && taily-1 <= heady && heady <= taily+1) {
        return [[headx,heady],[tailx,taily]]
    } else {
        if(headx === tailx || heady === taily) {
            if (headx < tailx){
                nextArr.push([tailx-1,taily]) // Move up
            } else if (headx > tailx) {
                nextArr.push([tailx+1,taily]) // Move down
            } else if (heady < taily) {
                nextArr.push([tailx,taily-1]) // Move left
            } else if (heady > taily) {
                nextArr.push([tailx,taily+1]) // Move right
            } else {
                // Do nothing
            }
        } else {
            if (headx<tailx && heady>taily) {
                nextArr.push([tailx-1,taily+1]) // Move top right
            } else if (headx<tailx && heady<taily) {
                nextArr.push([tailx-1,taily-1]) // Move top left
            } else if (headx>tailx && heady>taily) {
                nextArr.push([tailx+1,taily+1]) // Move bottom left
            } else if (headx>tailx && heady<taily) {
                nextArr.push([tailx+1,taily-1]) // Move bottom right
            } else {
                // Do nothing
            }
        }
        return nextArr
    }

}

function getNext(nextArr,dir,steps,p1orp2,HTorTT){
    let [hx,hy] = nextArr.shift()
    let [tx,ty] = nextArr[0]

    let nextMap = { R:[hx,hy+1], L:[hx,hy-1], U:[hx-1,hy], D:[hx+1,hy]}

    let [hx1,hy1] = nextMap[dir]

    if (p1orp2 === 'p1') {
        let nextStep = getNextStep(hx1,hy1,tx,ty);
        p1Seen.add(`${nextStep[1][0]}_${nextStep[1][1]}`);
        return nextStep
    } else {
        let p2nextArr = []
        let headx1 = hx1, heady1 = hy1

        for (i=0;i<9;i++){
            let p2nextStep = getNextStep(headx1,heady1,nextArr[i][0],nextArr[i][1]);
            p2nextArr.push(p2nextStep[0]);
            headx1 = p2nextStep[1][0];
            heady1 = p2nextStep[1][1];

            if(i === 8){
                p2nextArr.push(p2nextStep[1]);
                p2Seen.add(`${p2nextStep[1][0]}_${p2nextStep[1][1]}`)
            }
        }
        return p2nextArr
    }
}

// Part 1
lines.forEach(([direction,steps])=> {
    for(i=0;i<steps;i++){
        let nextStep = getNext(p1next,direction,steps,'p1')
        p1next = nextStep
    }
})
console.log(p1Seen.size) // Part 1 answer

// Part 2
lines.forEach(([direction,steps])=> {
    
    for(j=0;j<steps;j++){
        let p2nextArr = getNext(p2next,direction,steps,'p2')
        p2next = p2nextArr
    }
})
console.log(p2Seen.size) // Part 1 answer
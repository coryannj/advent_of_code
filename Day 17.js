const fs = require('fs');
const input = 'target area: x=179..201, y=-109..-63'
const inputTest = 'target area: x=20..30, y=-10..-5'
const numRegex = new RegExp(/[-]{0,1}\d+/, 'g');

function cumulativeSums(values) {
    let total = 0;
    const sums = [];
    values.forEach(v => {
        total += v;
        sums.push(total);
    });
    return sums;
}

let [tx,tx1,ty,ty1] = input.match(numRegex).map(Number)

//Part 1
let vyMax = 0

let result = {}
// console.log(y)

for(vy=-1000;vy<3000;vy++){
    let y1 = Array(300).fill(0).map((x,ix)=>ix === 0 ? x:(vy-(ix-1))*(ix-(ix-1)))

    let x1 = Array(300).fill(0).map((x,i)=>{
        if(i===0){
            return x
        } else {
            if(vy>(i-1)){
                return ((vy-(i-1))*(i-(i-1)))
            } else {
                return 0
            }
        }
    })
    let y2 = [...cumulativeSums(y1)]
    let x2 = [...cumulativeSums(x1)]

    if(y2.some((x)=>ty<=x&&x<=ty1)){
        let times = y2.map((x,ix)=>[x,ix]).filter(([x,i])=>ty<=x&&x<=ty1).map(([x,i])=>i)

        times.forEach((time)=>{
            if(result[time]===undefined){
                result[time] = {}
                
            }
            if(result[time]['y']===undefined){
                result[time]['y'] = []
            }
            result[time]['y'].push(vy)
        })

        if(Math.max(...y2)>vyMax){
            vyMax = Math.max(...y2)
        }
        
    }

    if(x2.some((x)=>tx<=x&&x<=tx1)){
        let xtimes = x2.map((x,ix)=>[x,ix]).filter(([x,i])=>tx<=x&&x<=tx1).map(([x,i])=>i)

       xtimes.forEach((time)=>{
            if(result[time]===undefined){
                result[time] = {}
            }
            if(result[time]['x']===undefined){
                result[time]['x'] = []
            }
            result[time]['x'].push(vy)
        })
    }
}

console.log(vyMax) // Part 1 answer

// Part 2
let p2result = new Set()

Object.entries(result).filter(([k,v])=> v['x'] !== undefined && v['y'] !== undefined).forEach(([k,v])=>{
    let xvals = v['x']
    let yvals = v['y']
    xvals.forEach((xval)=>{
        yvals.forEach((yval)=>{
            p2result.add(`${xval}-${yval}`)
        })
    })
})

console.log(p2result.size) // Part 2 answer
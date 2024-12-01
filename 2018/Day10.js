const fs = require('fs');
const input = fs.readFileSync('../day10input.txt',{ encoding: 'utf8', flag: 'r' });

const numRegex = /([-]{0,1}\d+)/g

let lines = input.split(/[\r\n]+/).map((x)=>x.match(numRegex).map(Number))

let pointsObj = {}

lines.forEach(([x,y,xv,yv],ix)=>{
    pointsObj[ix] = {}
    pointsObj[ix]['velocity'] = [xv,yv]
    pointsObj[ix]['coordinate'] = [x,y]
})

function move(time,points){

    Object.keys(points).forEach((k)=>{
        let [cxv,cyv] = points[k]['velocity']
        let [cx,cy] = points[k]['coordinate']
        let newx = cx+(cxv*time)
        let newy = cy+(cyv*time)
        
        points[k]['coordinate'] = [newx,newy]
    })

    let allPoints = Object.values(points).map((x)=>x.coordinate)
    let allx = allPoints.map((x)=>x[0]).sort((a,b)=>a-b)
    let ally = allPoints.map((x)=>x[1]).sort((a,b)=>a-b)

    let [minX,maxX,minY,maxY] = [allx[0],allx.at(-1),ally[0],ally.at(-1)]

   return [Math.abs(maxX-minX)*Math.abs(maxY-minY),points]

}

let areaMin = 10000000000000
let minTime = 0
let lastPoints = {}
let thisPoints = structuredClone(pointsObj)

for(i=0;i<50000;i++){
    let [area,coords] = move(1,thisPoints)
   
    thisPoints = coords
    if(areaMin!== 1000000000000 &&area<areaMin){
        areaMin = area
        lastPoints = structuredClone(coords)
        minTime = i
    }

    if(area>areaMin){
        break;
    }
    
}

let allPoints = Object.values(lastPoints).map((x)=>x.coordinate)
let allx = allPoints.map((x)=>x[0]).sort((a,b)=>a-b)
let ally = allPoints.map((x)=>x[1]).sort((a,b)=>a-b)

let [minX,maxX,minY,maxY] = [allx[0],allx.at(-1),ally[0],ally.at(-1)]

let size = Math.max(Math.abs(maxX-minX),Math.abs(maxY-minY))
let offset = Math.min(minX,minY)-5
let grid = Array(size*2).fill('.').map((x)=>Array(size*2).fill('x').map((x)=>'.'))

Object.values(lastPoints).map((x)=>x.coordinate).forEach(([c,r])=>{
grid[r-offset][c-offset] = '#'
})

grid.forEach((x)=>console.log(x.join(''))) // Part 1 answer


console.log('Part 2 answer is ',minTime+1) // Part 2 answer
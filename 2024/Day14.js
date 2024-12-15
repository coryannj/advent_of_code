const fs = require("fs");
require("../utils.js");
const { shoelace, md5, gcd, lcm, nextArr, nextArr8 } = require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day14.txt', {encoding: "utf8", flag: "r", });

const robots = input.lines().map((x)=>x.match(/[\d-]+/g).map(Number))
let maxX = 101
let maxY = 103
let seconds = 100

const move = ([x,y],xV,yV,seconds,maxX,maxY) => {
    let newX = (x + (xV*seconds))%maxX
    let newY = (y + (yV*seconds))%maxY

    if (newX<0) newX+=maxX
    if (newY<0) newY+=maxY

    return [newX,newY]
}

// Part 1
let moveAll = robots.map(([x,y,xV,yV])=>move([x,y],xV,yV,seconds,maxX,maxY))

let xMid = Math.floor(maxX/2);
let yMid = Math.floor(maxY/2);

let xQuad = [[0,xMid-1],[xMid+1,maxX-1]];
let yQuad = [[0,yMid-1],[yMid+1,maxY-1]];

let quads = xQuad.flatMap((x)=>yQuad.map((y)=>[x,y]));

let quadCount = [];

quads.forEach((q)=>{
    let [xMin,xMax] = q[0];
    let [yMin,yMax] = q[1];

    let countRobots = moveAll.filter(([rx,ry])=>xMin<=rx && rx<=xMax && yMin<=ry && ry<=yMax);
    quadCount.push(countRobots.length);
})

console.log('P1 answer is ',quadCount.filter((x)=>x>0).multiply())

// Part 2
let p2 = 0;

for(i=0;i<10000;i++){
    let c = robots.map(([x,y,xV,yV])=>move([x,y],xV,yV,i,maxX,maxY));
    let grid = Array(maxY).fill('.').map((x)=>Array(maxX).fill('.').map(y=>' '));
    
    c.forEach(([x,y])=>grid[y][x]='*')

    grid = grid.map((x,ix)=>x.join(''))

    if(grid.some((x)=>x.includes('******************************'))){
        // console.log('NEW LINE i is',i)
        p2 = i
        //grid.forEach((row)=>console.log(row))
        break;
    }
}

console.log('P2 answer is ',p2)
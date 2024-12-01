const fs = require('fs');
const input = fs.readFileSync('../day13input.txt',{ encoding: 'utf8', flag: 'r' });
const numRegex = /([-]{0,1}\d+)/g

let lines = input.replaceAll('\\','x').split(/[\r\n]+/).map((x)=>x.split(''))

let carts = []
let intersections = []
lines.forEach((x,ix)=>{
    x.forEach((val,vx)=>{
        if('^v<>'.includes(val)){
            carts.push([ix,vx,'L',val])
            if(val === '<'||val==='>'){
                lines[ix][vx]='-'
            } else {
                lines[ix][vx]='|'
            }
        }
        if(val === '+'){
            intersections.push(`${ix}-${vx}`)
        }
    })
})

let p2Carts = structuredClone(carts)

function cartStep([r,c,intDir,currDir]){
    //Check if on intersection
    if(intersections.includes(`${r}-${c}`)){

        let intnext = {
            '^':{
                'L':[r,c-1,'S','<'],
                'S':[r-1,c,'R','^'],
                'R':[r,c+1,'L','>']
        
            },
            'v':{                
                'L':[r,c+1,'S','>'],
                'S':[r+1,c,'R','v'],
                'R':[r,c-1,'L','<']
            },
            '<':{
                'L':[r+1,c,'S','v'],
                'S':[r,c-1,'R','<'],
                'R':[r-1,c,'L','^']
            },
            '>':{
                'L':[r-1,c,'S','^'],
                'S':[r,c+1,'R','>'],
                'R':[r+1,c,'L','v']
            }
        }

        return intnext[currDir][intDir]
    } else {
        let dirnext = {
            '^':{
                '|':[r-1,c,intDir,currDir],
                '/':[r,c+1,intDir,'>'],
                'x':[r,c-1,intDir,'<'],
            },
            
            'v':{
                '|':[r+1,c,intDir,currDir],
                '/':[r,c-1,intDir,'<'],
                'x':[r,c+1,intDir,'>'],
            },
            '<':{
                '-':[r,c-1,intDir,currDir],
                '/':[r+1,c,intDir,'v'],
                'x':[r-1,c,intDir,'^'],
            },
            '>':{
                '-':[r,c+1,intDir,currDir],
                '/':[r-1,c,intDir,'^'],
                'x':[r+1,c,intDir,'v'],
            }
        }
        return dirnext[currDir][lines[r][c]]
    }
}

let noCrash = true
let crashXY

while(noCrash){
    let nextCarts = []
    
    while(carts.length>0){
        let thisCart = carts.shift()
        let [nr,nc,nn,nd] = cartStep(thisCart)

        if(!nextCarts.some(([r,c,n,d],ix,arr)=>r === nr && c === nc) && !carts.some(([r,c,n,d],ix,arr)=>r === nr && c === nc)){
            nextCarts.push([nr,nc,nn,nd])
        }else{
            crashXY = [nc,nr]
            noCrash = false
            break;
        }
    }
    
    carts = nextCarts.sort((a,b)=>{
        if(a[0]===b[0]){
            return a[1]-b[1]
        } else {
            return a[0]-b[0]
        }
        })
}

console.log(crashXY.join(',')) // Part 1 answer

// Part 2

while(p2Carts.length>1){
    let nextCarts = []

    while(p2Carts.length>0){
        let thisCart = p2Carts.shift()
        let [nr,nc,nn,nd] = cartStep(thisCart)

        if(!nextCarts.some(([r,c,n,d],ix,arr)=>r === nr && c === nc) && !p2Carts.some(([r,c,n,d],ix,arr)=>r === nr && c === nc)){
            nextCarts.push([nr,nc,nn,nd])
        }else{
            nextCarts = nextCarts.filter(([r,c,n,d])=> r !== nr && c !== nc)
            p2Carts = p2Carts.filter(([r,c,n,d])=> r !== nr && c !== nc)
        }
    }
    
    p2Carts = nextCarts.sort((a,b)=>{
        if(a[0]===b[0]){
            return a[1]-b[1]
        } else {
            return a[0]-b[0]
        }
        })
}
console.log([p2Carts[0][1],p2Carts[0][0]].join(',')) // Part 2 answer
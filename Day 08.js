const fs = require('fs');
const input = fs.readFileSync('../day8input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(' ')).map((x,ix)=>[ix].concat(x.map((y,yx)=> yx === 0 ? y : Number(y))))

function getAcc(arr,p1orp2){
    let acc = 0
    let loop = structuredClone(arr)
    let queue = [loop[0]]
    let seen = new Set()
    
    while(queue.length>0 && !seen.has(queue[0][0]) && queue[0][0] !== lines.length-1){
        let [ind,dir,val] = queue.shift()
        seen.add(ind)
    
        if(dir === 'acc' || dir === 'nop'){
            acc += dir === 'acc' ? val : 0
            queue.push(loop[ind+1])
            continue;
        }
    
        if(dir === 'jmp'){
            queue.push(loop[ind+val])
            continue;
        }
    
    }
    
    return p1orp2 === 'p1' ? acc : [acc,queue[0][0]]
}

console.log('Part 1 answer is ',getAcc(lines,'p1'))

for(i=0;i<lines.length;i++){
    let loop
    if(['jmp','nop'].includes(lines[i][1])){
        let p2lines = structuredClone(lines);
        p2lines[i][1] = lines[i][1] === 'jmp' ? 'nop' : 'jmp';
        loop = getAcc(p2lines,'p2');

        if(loop[1] === lines.length-1){
            console.log('Part 2 answer is ',loop[0])
            break;
        }
    }
}



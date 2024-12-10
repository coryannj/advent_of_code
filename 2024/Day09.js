const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('./inputs/2024/day9.txt', {encoding: "utf8", flag: "r", });
const line = input.trim().split('').map(Number)
const lineLen = line.length

// Helper functions
const addFile = (file,id,charindex) => (file*id*charindex) + ((file-1)*file/2*id)

// Part 1 - version without mapping line to files/folders
let p1Split = line
let fileIndex = p1Split.length-1;
let fileId = (fileIndex)/2;
let currFile = p1Split[fileIndex];
let spaceIndex = p1Split[0];
let p1SplitResult = 0
let p0 = performance.now()
for(i=1; i<lineLen; i++){
    if(fileIndex === i){
        p1SplitResult += addFile(currFile,fileId,spaceIndex);
        break;
    }

    if(fileIndex<i)break;

    if(i%2 === 0){
        p1SplitResult += addFile(p1Split[i],i/2,spaceIndex);
        spaceIndex+=p1Split[i];
    } else {
        let space = p1Split[i];
        while (space > 0) {
            if(space>=currFile){
                p1SplitResult+=addFile(currFile,fileId,spaceIndex);
                space-=currFile;
                spaceIndex+=currFile;
                fileIndex-=2;
                fileId--;
                currFile = p1Split[fileIndex];
                continue;
                
            }
            if(space<currFile){
                p1SplitResult += addFile(space,fileId,spaceIndex);
                spaceIndex+=space;
                currFile-=space;
                space = 0;
                continue; 
            }
        }
    }
}
let p1 = performance.now()
console.log(p1SplitResult,' ',p1-p0)

// Part 1 - version with parsing line to files/folders
let p1parsed = []
let p2parsed = []
let p2ParseInd = 0
let id = 0

for (const[ix, val] of line.entries()){
    if(val > 0){
        if(ix%2 === 0){ 
            p1parsed.push(...Array(val).fill('.').map((x)=>id)) //files
            p2parsed.push([p2ParseInd,id,val])
            p2ParseInd+=val
            id++
        } else { 
            p1parsed.push(...Array(val).fill('.').map((x)=>x)) //free space
            p2parsed.push([p2ParseInd,'.',val])
            p2ParseInd+=val
        }
    }
}

let p1result = 0;
let ind = 0;
let lastInd = p1parsed.findLastIndex((x)=> typeof x === 'number');
let v0 = performance.now()
while(ind<=lastInd){
    while(p1parsed[lastInd] === '.'){
        lastInd--;
    }

    let next = p1parsed[ind];

    if(next === '.'){
        p1result+=(ind*p1parsed[lastInd]);
        lastInd--;
    } else {
        p1result+=(ind*next);
    }
    ind++;
}
let v1 = performance.now()
console.log(p1result,' ',v1-v0)

// Part 2
let p2result = 0;
let p2CurrId = id-1;

let t0 = performance.now()
while(p2CurrId>0){
    let [originalInd, p2FileId, p2FileLen] = p2parsed.pop();
    let freeIndex = p2parsed.findIndex(([i,v,len])=> v === '.' && len>=p2FileLen);

    if(freeIndex === -1){
        p2result += addFile(p2FileLen,p2FileId,originalInd);
    } else {
        p2result += addFile(p2FileLen,p2FileId,p2parsed[freeIndex][0]);
        if(p2parsed[freeIndex][2]===p2FileLen){
            p2parsed.splice(freeIndex,1)
        } else {
            p2parsed[freeIndex][0]+=p2FileLen;
            p2parsed[freeIndex][2]-=p2FileLen;
        }
    }
    
    while(p2parsed.at(-1)[1]==='.'){
        p2parsed.pop()
    }

    --p2CurrId;

}
let t1 = performance.now()
console.log(p2result,' ',t1-t0)
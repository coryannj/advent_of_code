const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day7input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.replaceAll('$ ','').replace('\/','root').split(/[\r\n]+/).filter((x)=> x !== 'ls').map((y)=> y.split(' '))

// Part 1
let fileMap = {}
let [firstc,firstv] = lines.shift();

fileMap[`${firstv}_0`]={allParents:[],dir:[],filenames:[],size:0};
let currentDir = `${firstv}_0`;
let currentLevel = 0;

// Populate directory - key is full path and level to avoid duplicate key issues e.g. 'root_0_vvsg_1_bwv_2_gwdh_3'
lines.forEach(([command,val])=>{
    if (command === 'cd'){
        if (val === '..') {
            currentLevel--;
            currentDir = fileMap[currentDir]['parentDir'];
        } else {
            currentLevel++;
            currentDir = fileMap[currentDir]['dir'].find((x)=>x.includes(`${val}_${currentLevel}`));
        }
    } else {
        if (command === 'dir') {
            fileMap[currentDir]['dir'].push(`${currentDir}_${val}_${currentLevel+1}`);

            if (!fileMap[`${currentDir}_${val}_${currentLevel+1}`]){
                fileMap[`${currentDir}_${val}_${currentLevel+1}`] = {
                    'parentDir':currentDir,
                    'allParents': fileMap[currentDir]['allParents'].concat(currentDir),
                    'dir':[],
                    'filenames':[],
                    'size':0
                };
            }
        } else {
            if (!fileMap[currentDir]['filenames'].includes(`${command}_${val}`)){
                fileMap[currentDir]['filenames'].push(`${command}_${val}`);
                fileMap[currentDir]['size']+=parseInt(command);
                fileMap[currentDir]['allParents'].forEach((parent)=>fileMap[parent]['size']+=parseInt(command)); // Add file size to all parents
            };
        }
    }
})

let limit = 100000
let underLimit = [...Object.values(fileMap)].map((val)=>val.size).filter((x)=> x<=limit).reduce((acc,curr)=>acc+curr);
console.log(underLimit) // Part 1 answer

//Part 2
let totalSpace = 70000000;
let requiredSpace = 30000000;
let usedSpace = fileMap[`${firstv}_0`]['size'];
let spaceNeeded = requiredSpace-(totalSpace-usedSpace);
let findDirectory = Object.values(fileMap).map((obj)=>obj.size).filter((x)=> x>=spaceNeeded);
console.log(Math.min(...findDirectory)) // Part 2 answer
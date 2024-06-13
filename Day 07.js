const fs = require('fs');
const { default: test } = require('node:test');
const { mainModule } = require('process');
const input = fs.readFileSync('../day7input.txt',{ encoding: 'utf8', flag: 'r' });

const lineSplit = /(?<=^[$]\s)([.\w|\s]*)/gm

let output = input.replace('\/','|').match(lineSplit)
//console.log(output)


let first = output.shift().match(/\S+/g)
filemap = {}
filemap['root_0']={dir:[first[1]],level:0}
filemap[`root_0_${first[1]}_1`]={parentDir:'root_0',level:1}
console.log(filemap)
let currentDir = `root_0_${first[1]}_1`
let currentLevel = 1

output.forEach((line)=>{
    console.log('line is ',line)
    if(line.charAt(0) === 'l') {
        let split = line.trim().split(/[\r\n]+/).slice(1).map((y)=> y.match(/\S+/g))
        //console.log(split)
        split.forEach(([f1,f2])=>{
            //console.log('f1,f2 is ',f1,f2)
            if (f1 === 'dir') {
               // console.log('f1 is dir')
                if (filemap[currentDir][f1] === undefined){
                    filemap[currentDir][f1] = []
                }
                filemap[currentDir][f1].push(`${currentDir}_${f2}_${currentLevel+1}`)
                
                if (filemap[`${currentDir}_${f2}_${currentLevel+1}`] === undefined){
                    filemap[`${currentDir}_${f2}_${currentLevel+1}`] = {}
                    filemap[`${currentDir}_${f2}_${currentLevel+1}`]['parentDir']=currentDir
                    filemap[`${currentDir}_${f2}_${currentLevel+1}`]['level']=currentLevel+1
                }
            } else {
                //console.log('f1 is something else')
                if (filemap[currentDir]['filesizes']=== undefined){
                    filemap[currentDir]['filesizes']=[]
                }
                if (filemap[currentDir]['filenames']=== undefined){
                    filemap[currentDir]['filenames']=[]
                }
                
                if (!filemap[currentDir]['filenames'].includes(`${f1}_${f2}`)){
                    filemap[currentDir]['filenames'].push(`${f1}_${f2}`)
                    filemap[currentDir]['filesizes'].push(parseInt(f1))
                }
            }
            
        })
        //console.log(filemap)
    } else {
        let [command,val] = line.match(/\S+/g)
        if (command === 'cd') {
            if (val !== '..') {
                currentLevel++
                let nextCurrentDir = filemap[currentDir]['dir'].find((x)=>x.includes(`${val}_${currentLevel}`))

                currentDir = nextCurrentDir
                
                
                console.log('currentDir is now ',currentDir,' current level is now ',currentLevel)
            } else {
                let parent = filemap[currentDir]['parentDir']
                currentDir = parent
                currentLevel--
               // console.log('currentDir is now ',currentDir,' current level is now ',currentLevel)
            } 
        }
    }

    
})
console.log(filemap)

//console.log(Object.entries(filemap))

let fileSizeMap = {}
Object.keys(filemap).forEach((key)=>fileSizeMap[key]=0)

let allLevels = Object.values(filemap).map((x)=>x.level).sort((a,b)=>b-a)
let levels = [...new Set(allLevels)]
console.log(levels)

levels.forEach((thisLevel)=>{
    let levelQueue = [...Object.entries(filemap)].filter(([key,value])=>value.level === thisLevel)

    console.log(levelQueue.map(([key,val])=>val.filesizes !== undefined ? eval(val.filesizes.join('+')):0).reduce((acc,curr)=>acc+curr))
    //console.log('levelQueue is ',levelQueue)
    levelQueue.forEach(([nkey,nvalue]) => {
        // Update filesize for current directory
        if(nvalue.filesizes !== undefined && nvalue.filesizes.length>0){
            let fileSize = nvalue.filesizes.reduce((acc,curr)=> acc+curr)
            fileSizeMap[nkey]+=fileSize
        }

        // Add filesize to parent directory and add parent to queue
        if (nvalue.parentDir !== undefined){
            fileSizeMap[nvalue.parentDir]+=fileSizeMap[nkey]
        }
    })
    console.log([...Object.entries(fileSizeMap)].filter(([key,value])=>parseInt(key.slice(-1))===thisLevel).map((x)=>x[1]).reduce((acc,curr)=>acc+curr))
})

console.log(fileSizeMap)

let limit = 100000

let underLimit = [...Object.values(fileSizeMap)].filter((x)=> x<=limit)
console.log(underLimit)
//console.log(underLimit.map((x)=>))




console.log(underLimit.reduce((acc,curr)=>acc+curr)) // Part 1 answer

//Part 2
let totalSpace = 70000000
let requiredSpace = 30000000
let usedSpace = fileSizeMap['root_0']
let spaceNeeded = requiredSpace-(totalSpace-usedSpace)

let findDirectory = Object.values(fileSizeMap).filter((x)=> x>=spaceNeeded).sort((a,b)=>a-b)
console.log(findDirectory[0]) // Part 2 answer

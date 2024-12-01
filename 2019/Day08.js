const fs = require('fs');
const input = fs.readFileSync('../day8input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split('')

let w = 25
let l = 6

// https://stackoverflow.com/questions/8495687/split-array-into-chunks
function* chunks(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n);
    }
}

//https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
function count(arr) {
return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
}

// Part 1
let allLayers = [...chunks(lines,w)]
let layers = [...chunks(allLayers,l)]
let findFewest = layers.map((x)=>count(x.flat())).sort((a,b)=>a[0]-b[0])
let fewestZeros = findFewest[0]
let result = fewestZeros[1]*fewestZeros[2]
console.log(result) // Part 1 answer

// Part 2
let layerCount = layers.length
let allPixels = []

for(i=0;i<l;i++){
    for(j=0;j<w;j++){
        let pixel = layers.map((x)=>x[i][j]).find((x)=>x!=='2')
        allPixels.push(pixel)
    }
}

let image = [...chunks(allPixels,w)]

image.forEach((layer)=>console.log(layer.join('').replaceAll('0',' ').replaceAll('1','@'))) // Part 2 answer
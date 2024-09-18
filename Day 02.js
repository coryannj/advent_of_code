const fs = require('fs');
const input = fs.readFileSync('../day2input.txt',{ encoding: 'utf8', flag: 'r' });

//https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
function count(arr) {
    return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
}

let lines = input.split(/[\r\n]+/).map((x)=>x.split(''))
//console.log(lines)

let lineCount = lines.map((x)=>count(x))

let hasTwo = lineCount.filter((x)=>Object.values(x).includes(2))
let hasThree = lineCount.filter((x)=>Object.values(x).includes(3))

console.log(hasTwo.length*hasThree.length) // Part 1 answer

let firstWord
let secondWord

while(!firstWord){
    let thisWord = lines.shift()
    lines.forEach((word)=>{
        let differences = 0
        word.forEach((letter,ix)=>{
            if(letter !== thisWord[ix]){
                differences++
            }
        })
        if(differences === 1){
            firstWord = thisWord
            secondWord = word
        }
    })

}

console.log(firstWord.filter((x,ix)=>x===secondWord[ix]).join('')) // Part 2 answer

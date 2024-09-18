const fs = require('fs');
const input = fs.readFileSync('../day5input.txt',{ encoding: 'utf8', flag: 'r' });

const reactRegex = /(aA|bB|cC|dD|eE|fF|gG|hH|iI|jJ|kK|lL|mM|nN|oO|pP|qQ|rR|sS|tT|uU|vV|wW|xX|yY|zZ|Aa|Bb|Cc|Dd|Ee|Ff|Gg|Hh|Ii|Jj|Kk|Ll|Mm|Nn|Oo|Pp|Qq|Rr|Ss|Tt|Uu|Vv|Ww|Xx|Yy|Zz)/

let currStr = input
let newStr = currStr.replace(reactRegex,'')

while(currStr.length !== newStr.length){
    currStr = newStr    
    newStr = currStr.replace(reactRegex,'')
}

console.log(newStr.length) // Part 1 answer

// Part 2
let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
let minLen = 1000000

alphabet.forEach((letter)=>{
    let remove = new RegExp(letter, "gi");
    let currStr = input.replaceAll(remove,'')
    let newStr = currStr.replace(reactRegex,'')

    while(currStr.length !== newStr.length){
        currStr = newStr    
        newStr = currStr.replace(reactRegex,'')
    }

    if(newStr.length<minLen){
        minLen = newStr.length
    }
})

console.log(minLen) // Part 2 answer
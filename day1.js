const fs = require('fs');
const inputload = fs.readFileSync('../day1input.txt',{ encoding: 'utf8', flag: 'r' });
const input = inputload.split(/[\r\n]+/)

//Part 1

//Regex to get first and last digits
let firstlastregex = /(?:^|\D+)(?<first>\d).*?(?<last>\d{0,1})(?=\D*$)/m

//Map runs above regex on each line and checks for 1 or 2 matches. If 2 matches joins first and last in string, if 1 match only then join to itself, then convert to number and sum the array
let calibrationsum1 = input
.map((x) => {
    let match = x.match(firstlastregex)
    let first = match[1]
    let last = match[2]
    return last.length>0 ? parseInt(first.concat(last)):parseInt(first.concat(first))
})
.reduce((acc,curr) => acc + curr,0)
console.log(calibrationsum1)

//Part 2

//Regex - seperate for first and last bc of overlapping letters ugh
let firstregex = /(one|two|three|four|five|six|seven|eight|nine|\d).*/
let lastregex = /.*(one|two|three|four|five|six|seven|eight|nine|\d)/

//Map runs regex and replaces words, then sum array with reduce
let calibrationsum2 = input
.map((x) => {
    function replacewords(str) {
        return str.includes('one') ? str.replace('one','1') : str.includes('two') ? str.replace('two','2') : str.includes('three') ? str.replace('three',3) : str.includes('four') ? str.replace('four','4') : str.includes('five') ? str.replace('five','5') : str.includes('six') ? str.replace('six','6') : str.includes('seven') ? str.replace('seven','7') : str.includes('eight') ? str.replace('eight','8') : str.includes('nine') ? str.replace('nine','9') : str
    }
    
    let first = replacewords(x.match(firstregex)[1])
    let last = replacewords(x.match(lastregex)[1])
    
    return last.length>0 ? parseInt(first.concat(last)):parseInt(first.concat(first))
})
.reduce((acc,curr) => acc + curr,0)
console.log(calibrationsum2)
const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../../day3.txt', {encoding: "utf8", flag: "r", });

const mulRe = /(?<=mul[(])(\d+[,]\d+)(?=[)])/g
const doRe = /do[(][)]/
const dontRe = /don[']t[(][)][\s\S]+/

console.log(input.match(mulRe).mk2d(',',1).map(x=>x[0]*x[1]).sum()) // Part 1 answer

console.log(input.split(doRe).flatMap(x=>x.replace(dontRe,'').match(mulRe)?.mk2d(',',1).map(x=>x[0]*x[1])).sum()) // Part 2 answer

// Version with eval just for fun :-D

console.log(eval(input.replaceAll(',','*').match(/(?<=mul)([(]\d+[*]\d+[)])/g).join('+')))

console.log(eval(input.replaceAll(',','*').split(/do[(][)]/).map((x) => x.replace(/don[']t[(][)][\s\S]+/,'')).join('').match(/(?<=mul)([(]\d+[*]\d+[)])/g).join('+')))
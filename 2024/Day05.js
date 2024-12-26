
const fs = require("fs");
const input = fs.readFileSync('../inputs/2024/day5.txt', {encoding: "utf8", flag: "r", });

let [rules,p] = input.split(/\n\n/);
let ruleObj = Object.fromEntries(rules.split(/[\r\n]+/).map((x)=> [x,-1]));
let pages = p.split(/[\r\n]+/), pageLen = pages.length, p1 = 0, p2 = 0;

for(i = 0; i < pageLen; i++){
    let line = pages[i].replaceAll(',','|'), score = 0, lineLen = line.length;

    for(j = 0; j < lineLen-3; j+=3){
        if(!ruleObj[line.slice(j,j+5)]) break;
        score++;
    }

    if(score === (lineLen-2)/3){
        p1 += parseInt(line[(lineLen/2)-1]+line[(lineLen/2)]);
    } else {
        p2 += parseInt(line.split('|').sort((a,b)=>ruleObj[a+'|'+b] ?? 1)[Math.floor((lineLen+1)/6)]);
    }
}

console.log(p1,p2)
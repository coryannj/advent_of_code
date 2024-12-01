const fs = require('fs');
const input = fs.readFileSync('../day13input.txt',{ encoding: 'utf8', flag: 'r' });

const lines = input.split(/\n\n/).map((x)=> x.split(/[\r\n]+/).map((y)=>JSON.parse(y)))

function compare(left,right) {
    if (typeof left === 'number' && typeof right === 'number') {
        if(left>right){
            return -1
        } else if (right>left){
            return 1
        } else {
            return 0
        }
    } else if ((typeof left === 'array'|| typeof left === 'object') && (typeof right === 'array'||typeof right === 'object')) {        
        if (left.length>0 && right.length === 0) {
            return -1
        } else if (left.length === 0 && right.length > 0) {
            return 1
        } else if (left.length === 0 && right.length === 0) {
            return 0
        } else {
            return compareAll(left,right)
        }

    } else {
        if (left === undefined || right === undefined){
            if (left !== undefined) {
                return -1
            } else {
                return 1
            }
        } else { // One is array and one is a number
            if (typeof left === 'number') {
                return compareAll([left],right)
            } else {
                return compareAll(left,[right])
            }
        }
    }
}

function compareAll(leftarr,rightarr){
    let result = 0;

    let leftmap = JSON.parse(JSON.stringify(leftarr));
    let rightmap = JSON.parse(JSON.stringify(rightarr));

    while (leftmap.length > 0 || rightmap.length > 0){
        result = compare(leftmap.shift(),rightmap.shift())
        if (result !== 0){
            break;
        }
    }
    return result
}

// Part 1
let indices = []

let p1lines = JSON.parse(JSON.stringify(lines))

p1lines.forEach(([lineleft,lineright],lineidx)=>{
    if(compare(lineleft,lineright) !== -1){
        indices.push(lineidx+1)
    }
})

console.log(indices.reduce((acc,curr)=> acc+curr)) //Part 1 answer

// Part 2
let p2lines = input.split(/[\r\n]+/).map((y)=>JSON.parse(y))

p2lines.push([[2]])
p2lines.push([[6]])

p2lines.sort((a,b)=>compare(b,a))

let firstindex = p2lines.findIndex((x)=>JSON.stringify(x)=== JSON.stringify([[2]]))
let secondindex = p2lines.findIndex((x)=>JSON.stringify(x)=== JSON.stringify([[6]]))

console.log((firstindex+1)*(secondindex+1)) // Part 2 answer
const fs = require('fs');
require('../utils.js');
const input = fs.readFileSync('../inputs/2016/day02.txt', {encoding: "utf8", flag: "r", });

const keypad1 = {
    1:{ R:'2', D:'4'},
    2:{ L:'1', R:'3', D:'5'},
    3:{ L:'2', D:'6'},
    4:{ R:'5', U:'1', D:'7'},
    5:{ L:'4', R:'6', U:'2', D:'8'},
    6:{ L:'5', U:'3', D:'9'},
    7:{ R:'8', U:'4'},
    8:{ L:'7', R:'9', U:'5'},
    9:{ L:'8', U:'6'}
}

const keypad2 = {
    1:{D:'3'},
    2:{R:'3', D:'6'},
    3:{L:'2', R:'4', U:'1', D:'7'},
    4:{L:'3', D:'8'},
    5:{R:'6'},
    6:{L:'5', R:'7', U:'2', D:'A'},
    7:{L:'6', R:'8', U:'3', D:'B'},
    8:{L:'7', R:'9', U:'4', D:'C'},
    9:{L:'8'},
    A:{R:'B', U:'6'},
    B:{L:'A', R:'C', U:'7', D:'D'},
    C:{L:'B', U:'8'},
    D:{U:'B'}
}

const lines = input.split(/\n/g).map((x)=>x.split(''))

const solve = (partNo) =>{
    code = ''
    button = '5'

    lines.forEach((l)=>{
        l.forEach((dir)=>{
            button = (partNo === 1 ? keypad1[button]?.[dir] : keypad2[button]?.[dir])||button
        })
        code+=button
    })
    return code
}

console.log(solve(1))
console.log(solve(2))
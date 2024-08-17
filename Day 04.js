const fs = require('fs');
const input = fs.readFileSync('../day4input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\n/).map((x)=>x.split(/\s+/g).map((y)=>y.split(':'))).map((x)=>x.sort((a,b)=>a[0].localeCompare(b[0])))

let hasFields = lines.filter((x)=> x.length === 8 || (x.length === 7 && !x.some(([k,v])=> k === 'cid')))

console.log(hasFields.length) // Part 1 answer

function checkPassport(passport){
    let valid = true
    let toCheck = structuredClone(passport)

    while(valid === true && toCheck.length>0){
        let [k,v] = toCheck.shift()

        let checkValid = {
            'byr': /^(19[2-9][0-9]|200[0-2])$/m.test(v),
            'iyr': /^(201[0-9]|2020)$/m.test(v),
            'eyr': /^(202[0-9]|2030)$/m.test(v),
            'hgt':/^(1[5-8][0-9]cm|19[0-3]cm|59in|6[0-9]in|7[0-6]in)$/m.test(v),
            'hcl': /(^[#][0-9a-f]{6}$)/m.test(v),
            'ecl': /^(amb|blu|brn|gry|grn|hzl|oth)$/m.test(v),
            'pid': /^([0-9]{9})$/m.test(v),
            'cid': true
        }
        valid = checkValid[k]               
    }
   return valid
}

console.log(hasFields.filter((passport)=>checkPassport(passport)).length) //Part 2 answer


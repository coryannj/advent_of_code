const fs = require('fs');
const input = fs.readFileSync('../day4input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/\n\n/).map((x)=>x.split(/\s+/g).map((y)=>y.split(':'))).map((x)=>x.sort((a,b)=>a[0].localeCompare(b[0])))

let hasFields = lines.filter((x)=> x.length === 8 || (x.length === 7 && !x.some(([k,v])=> k === 'cid')))

console.log(hasFields.length) // Part 1 answer

function checkPassport(passport){
    let valid = true
    let toCheck = passport.slice()

    while(valid === true && toCheck.length>0){
        let [k,v] = toCheck.shift()

        if(k === 'byr' && (v.length !== 4 || isNaN(parseInt(v))||(parseInt(v)<1920||parseInt(v)>2002))){
            valid = false
            continue;
        }
        if(k === 'iyr' && (v.length !== 4 ||isNaN(parseInt(v))||(parseInt(v)<2010||parseInt(v)>2020))){
            valid = false
            continue;
        }
        if(k === 'eyr' && (v.length !== 4 ||isNaN(parseInt(v))||(parseInt(v)<2020||parseInt(v)>2030))){
            valid = false
            continue;
        }
        if(k === 'hgt'){

            if(v.slice(-2) !== 'cm' && v.slice(-2) !== 'in'){
                valid = false
                continue;
            } else {
                if(v.slice(-2) === 'cm' && (isNaN(parseInt(v.slice(0,-2)))|| parseInt(v.slice(0,-2))<150||parseInt(v.slice(0,-2))>193)){
                    valid = false
                    continue;
                }
    
                if(v.slice(-2) === 'in' && (isNaN(parseInt(v.slice(0,-2)))|| parseInt(v.slice(0,-2))<59||parseInt(v.slice(0,-2))>76)){
                    valid = false
                    continue;
                }
            }

        }

        if(k === 'hcl' && (v.charAt(0) !== '#' || (v.length !== 7 || !v.slice(1).split('').every((x)=> '0123456789abcdef'.includes(x))))){
            valid = false
            continue;
        }

        if(k === 'ecl' && !['amb','blu','brn','gry','grn','hzl','oth'].includes(v)){
            valid = false
            continue;
        }

        if(k === 'pid' && (v.length !== 9 || !v.split('').every((x)=> '0123456789'.includes(x)))){
            valid = false
            continue;
        } 
               
    }
   return valid
}

console.log(hasFields.filter((passport)=>checkPassport(passport)).length) //Part 2 answer


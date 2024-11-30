const crypto = require('crypto');
let input = 'ugkcyxxp'

let counter = 0
let hash
let password = ''
let password2 = ['_','_','_','_','_','_','_','_']

while(password.length<8){
    hash = crypto.createHash('md5').update(`${input}${counter}`).digest('hex');

    if(hash.slice(0,5)==='00000'){
        password+=hash[5]

        if('01234567'.includes(hash[5]) && password2[hash[5]]==='_'){
            password2[hash[5]] = hash[6]
        }
    }
    counter++
}

console.log(password) // Part 1 answer

let counter2 = counter
let hash2

while(password2.includes('_')){
    hash2 = crypto.createHash('md5').update(`${input}${counter2}`).digest('hex');

    if(hash2.slice(0,5)==='00000' && '01234567'.includes(hash2[5]) && password2[hash2[5]]==='_'){
        password2[hash2[5]] = hash2[6]
    }
    counter2++
}

console.log(password2.join('')) // Part 2 answer
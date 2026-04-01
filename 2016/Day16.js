const solve = (len) => {
    let str = '00101000101111010'
    
    while(str.length<len){
        str += '0'+str.split('').reverse().join('').replace(/[0-1]/g,m=>m === '0' ? '1' : '0')
    }

    str = str.slice(0,len)

    do{
        str = str.replace(/([0-1]{2})/g,m=> m[0] === m[1] ? '1' : '0')
    } while(str.length%2 !== 1)

    return str
}

console.log(solve(272))
console.log(solve(35651584))


let lines = '13,0,10,12,1,5,8'.split(',').map(Number)
let p1Turns = 2020
let p2Turns = 30000000
let turns = lines.length

let seen = {}

lines.forEach((x,ix)=>{
    seen[x] = [ix]
})

let last = lines.at(-1)

while(turns<p2Turns){

    let prev = seen[last].slice(-2)

    if(prev.length === 1){
        seen[0].push(turns)
        if(seen[0].length>2){
            seen[0].shift()
        }
        last = 0
    } else {
        if (seen[prev[1]-prev[0]] === undefined){
            seen[prev[1]-prev[0]] = [turns]
        } else {
            seen[prev[1]-prev[0]].push(turns)
            if(seen[prev[1]-prev[0]].length>2){
                seen[prev[1]-prev[0]].shift()
            }
        }
        last = prev[1]-prev[0]
    }
    turns++
    if(turns === p1Turns){
        console.log('Part 1 answer is ',last)
    }

    // if(turns%1000000 === 0){
    //     console.log('turns is ',turns)
    // }
}
console.log('Part 2 answer is ',last)

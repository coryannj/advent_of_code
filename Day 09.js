const fs = require('fs');

//465 players; last marble is worth 71498 points

let noOfPlayers = 465
let lastMarble = 71498
let scores ={}
for(i=0;i<noOfPlayers;i++){
    scores[i] = 0
}
//console.log(scores)

let marbles = {
    '0':2,
    '2':1,
    '1':0
}

let current = 2
let nextCurrent = current+1
let playerCounter = 2
let currSeen = []

while(current<lastMarble*100){
    if(current%100000===0){
        console.log('current is ',current)
    }
    let playerIndex = playerCounter%noOfPlayers
   // console.log('current,NextCurrent ',current,nextCurrent)
    if((nextCurrent)%23 !== 0){
        let oneAfter = marbles[current]
        let twoAfter = marbles[oneAfter]
      //  console.log('playerIndex',playerIndex,' current is ',current,' oneAfter,twoafter',oneAfter,twoAfter)
        marbles[oneAfter] = nextCurrent
    
        marbles[nextCurrent] = twoAfter
        //console.log('playerCounter',playerCounter,'playerIndex',playerIndex,' current is ',current,' oneAfter,twoafter',oneAfter,twoAfter, ' curr',marbles[nextCurrent])
        current = nextCurrent
        nextCurrent = current+1
    } else {
       // console.log('reached 23')
        scores[playerIndex]+=current+1

        let minus7Val = current
        let minus7Key

        for(i=0;i<7;i++){
            minus7Key= Object.keys(marbles).find((x)=>marbles[x]===parseInt(minus7Val))
           // console.log('minus7',minus7Val,minus7Key)
            minus7Val = minus7Key
        }
       // console.log('final minus7',minus7Val,minus7Key)
        scores[playerIndex]+=parseInt(minus7Val)
        let prevKey = Object.keys(marbles).find((x)=>marbles[x] === parseInt(minus7Val))
        let nextCurr = marbles[minus7Val]
        

       //console.log('prevkey,nextkey',prevKey,nextCurr)
        marbles[prevKey] = nextCurr
        delete marbles[minus7Val]
        nextCurrent++
        current = nextCurr
        

    }
    
    //console.log(marbles)


    playerCounter++
}
//console.log(marbles)
console.log(Object.values(scores).sort((a,b)=>b-a)[0])
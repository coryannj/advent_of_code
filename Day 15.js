let genA = 16807
let genB = 48271
let divisor = 2147483647
let startA = 783
let startB = 325
let count1 = 0
let count2 = 0

function nextVal([a,b],partNo){
    let newA = (a*genA)%divisor
    let newB = (b*genB)%divisor

    if(partNo !== 1){
        while(newA%4 !== 0){
            newA*=genA
            newA%=divisor
        }

        while(newB%8 !== 0){
            newB*=genB
            newB%=divisor
        }
    }
    
    if(((newA & 0xFFFF) == (newB & 0xFFFF))){
        partNo === 1 ? count1++ : count2++
    }

    return [newA,newB]
}

// Part 1
let pairs1 = 40000000
let p1A = startA
let p1B = startB

while(pairs1>0){
    let [nxtA,nxtB] = nextVal([p1A,p1B],1)
    p1A = nxtA
    p1B = nxtB
    pairs1--
}

console.log(count1)

// Part 2
let pairs2 = 5000000
let p2A = startA
let p2B = startB

while(pairs2>0){
    let [nxtA,nxtB] = nextVal([p2A,p2B],2)
    p2A = nxtA
    p2B = nxtB
    pairs2--
}

console.log(count2)
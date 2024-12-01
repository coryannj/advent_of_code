let recipes = [3,7]
let e1 = 0
let e2 = 1
let rTotal = 2
let noRecipes = 909441
let noStr = noRecipes.toString()
let noStrLen = noStr.length
let offset = 99999999
let p2arr = recipes.slice()

let loop = noRecipes+offset

while(loop>0){

    let newR = recipes[e1]+recipes[e2]

    if(newR<10){
        recipes.push(newR)
        p2arr.push(newR)
        if(p2arr.length>noStrLen){
            p2arr.shift()
        }
        rTotal++
    } else {
        rTotal += 2
        recipes.push(parseInt(newR.toString()[0]))
        recipes.push(parseInt(newR.toString()[1]))
        
        p2arr.push(parseInt(newR.toString()[0]))

        if(p2arr.length>noStrLen){
            p2arr.shift()
        }

        if(p2arr.join('')===noStr){
            break;
        } else {
            p2arr.push(parseInt(newR.toString()[1]))
            if(p2arr.length>noStrLen){
                p2arr.shift()
            }
        }
    }

    e1 = (e1+recipes[e1]+1)%rTotal
    e2 = (e2+recipes[e2]+1)%rTotal

    if(p2arr.join('')===noStr){
        break;
    }

    loop--
}

console.log('p1answer is ',recipes.slice(noRecipes,noRecipes+10).join(''))

let sliceLen = noStrLen

while(!recipes.slice((-1*sliceLen)).join('').includes(noStr)){
    sliceLen++
}

console.log('p2answer is ',rTotal-sliceLen)



const fs = require('fs');
const input = fs.readFileSync('../day21input.txt',{ encoding: 'utf8', flag: 'r' });

let lines = input.split(/[\r\n]+/).map((x)=>x.split(' (contains ')).map((x)=>[x[0].split(' '),x[1].slice(0,-1).split(', ')])

let allIngredients = [... new Set(lines.flatMap((x)=>x[0]))]
let allAllergens = [...new Set(lines.flatMap((x)=>x[1]))]

let allergies = {}

allAllergens.forEach((allergen)=>{
    let matching = lines.filter(([ing,all])=> all.includes(allergen))

    let ingredients = allIngredients.filter((x)=> matching.every(([ing,all])=> ing.includes(x)))
    allergies[allergen] = ingredients
})

let identified = Object.entries(allergies).filter((x)=>x[1].length === 1).flatMap((x)=>x[1])

while(Object.entries(allergies).some((x)=>x[1].length > 1 && x[1].some((y)=>identified.includes(y)))){
    let remove = Object.entries(allergies).filter((x)=>x[1].length > 1 && x[1].some((y)=>identified.includes(y)))

    remove.forEach(([a,ingr])=>{
        let updatedIngredients = allergies[a].filter((x)=> !identified.includes(x))

        allergies[a] = updatedIngredients

        if(updatedIngredients.length === 1){
            identified.push(updatedIngredients[0])
        }
    })
}

let allAllergyIngredients = Object.values(allergies).flat()

console.log(lines.flatMap((x)=>x[0]).filter((y)=> !allAllergyIngredients.includes(y)).length) // Part 1 answer

console.log(Object.entries(allergies).sort((a,b)=>a[0].localeCompare(b[0])).flatMap((x)=> x[1]).join(',')) // Part 2 answer
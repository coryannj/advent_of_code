const { match } = require("assert");
const fs = require("fs");
require("../utils.js");
const input = fs.readFileSync('../inputs/2024/day24.txt', {encoding: "utf8", flag: "r", });

let lines = input.lines(2).map((x)=>x.lines());
let p1gates = Object.fromEntries(lines[0].map((x)=>x.split(': ').map((y,yx)=>yx>0?parseInt(y):y)))
let inst = lines[1].map((x)=>x.split(/[\s\W]+/));
let zVals = [...new Set(inst.flat().filter((x)=>x[0]==='z').sort((a,c)=>c.localeCompare(a)))]

// Part 1
const runGates = (gates,inputs) => {
    let inputsLen = inputs.length;
    let inputsCounter = 0;

    while(zVals.some((x)=>gates[x]===undefined)){
        let [p1,op,p2,dest] = inputs[inputsCounter%inputsLen];
        inputsCounter++;
        let param1 = gates[p1];
        let param2 = gates[p2];
    
        if(param1 === undefined || param2 === undefined) continue;
    
        const ops = {
            AND: (par1,par2) => {return par1 === 1 && par2 === 1 ? 1 : 0},
            OR: (par1,par2) => {return par1 === 1 || par2 === 1 ? 1 : 0},
            XOR: (par1,par2) => {return par1 !== par2 ? 1 : 0},
        }
    
        gates[dest] = ops[op](param1,param2)
    }

    return parseInt(zVals.map((x)=>gates[x]).join(''),2)
}

console.log('Part 1 answer is ',runGates(p1gates,inst))

// Part 2
let p2Input = input.lines(2)[0].replaceAll(/\d+$/gm,'0').lines().map((x)=>x.split(': ').map((y,yx)=>yx>0?parseInt(y):y))
let p2Inst = structuredClone(inst)
let xyGates = [...new Set(p2Input.map((x)=>x[0].slice(1)))].slice(0,-1)

let xorNotZ = p2Inst.filter((x)=>x[1]==='XOR' && !'xy'.includes(x[0][0]) && !'xy'.includes(x[2][0]) && x[3][0]!=='z');
let xNotXOR = p2Inst.filter((x)=>x[3][0]==='z' && x[1] !== 'XOR' && xyGates.includes(x[3].slice(1))).sort((a,c)=>a[3].localeCompare(c[3]));
let xyWrongWay = p2Inst.find((p,ix,arr)=>!xNotXOR.map((xv)=>xv[3].slice(1)).includes(p[0].slice(1)) && 'xy'.includes(p[0][0]) && 'xy'.includes(p[2][0]) && p[1]==='AND' && arr.some((av)=>av[3][0]==='z' && av[2] ===p[3]));
let xyWrongWayPair = p2Inst.find((p)=>(p[0]===xyWrongWay[0]||p[0]===xyWrongWay[2]) && p[1]==='XOR');

let foundPairs = xorNotZ.map((x)=>x[3]).concat(xNotXOR.map((x)=>x[3]),xyWrongWay[3],xyWrongWayPair[3]).sort();

console.log('Part 2 answer is ',foundPairs.join(','))

// Old code to manually pair off the first 3 swaps, and find the index for the remaining one
//let p2Gates = Object.fromEntries(p2Input)

// xNotXOR.forEach((x)=>{
//     let [p1,ins,p2,output] = x
//     let adj1 = p2Inst.filter((y)=>y.join('') !== x.join('') && (y.includes(p1)||y.includes(p2)||y.includes(output)))
//     let xInd = p2Inst.findIndex((p)=>p.join('')===x.join(''))
//     let matchInd,matchVal

//     if(xorNotZ.some((v)=>[v[0],v[2]].includes(p1) && [v[0],v[2]].includes(p2))){
//         matchInd = p2Inst.findIndex((y)=>y.join('')!==x.join('') &&[y[0],y[2]].includes(p1) && [y[0],y[2]].includes(p2));

//         matchVal = p2Inst[matchInd][3];
//     } else {
//         let notZ = xorNotZ.find((n)=>adj1.some((av)=>av.includes(n[0])||av.includes(n[2])))
//         matchInd = p2Inst.findIndex((p)=>p.join('')===notZ.join(''));
//         matchVal = notZ[3];
//     }

//     foundPairs.push(output,matchVal);
//     p2Inst[matchInd][3] = output;
//     p2Inst[xInd][3] = matchVal;
// })

// Find remaining broken by searching for indexes where sum of x + y !== z
// const findBroken = () => {
//     let checkIndex = 0
//     let investigate = []


//     const getBinary = (xyz) => Object.entries(p2Gates).filter(([k,v])=>k[0]===xyz).sort((a,c)=>c[0].localeCompare(a[0])).map((x)=>x[1]).join('')

//     while(checkIndex<xyGates.length){
//         p2Gates[`x${xyGates.at(-1)}`] = 1
//         p2Gates[`y${xyGates.at(-1)}`] = 1
//         p2Gates[`x${xyGates[checkIndex]}`] = 1;
//         p2Gates[`y${xyGates[checkIndex]}`] = 1;
//         let xStart = getBinary('x');
//         let yStart = getBinary('y');
//         let [xNum,yNum] = [parseInt(xStart,2),parseInt(yStart,2)];

//         let zNum = runGates(p2Gates,p2Inst);;
        
//         if(zNum !== xNum+yNum){
//             investigate.push(xyGates[checkIndex]);
//         }

//         p2Gates = Object.fromEntries(p2Input)
//         checkIndex++
//     }

//     return investigate
// }

// let toInvestigate = findBroken()

// toInvestigate.forEach((x)=>{
//     let zVal = `z${x}`;
//     let zOutput = p2Inst.find((v)=>v[3]===zVal); //XOR val

//     let adj1 = p2Inst.filter((v)=>v.includes(zOutput[2]) && v.join('')!==zOutput.join(''));

//     for(const c of adj1.values()){
//         if(c.includes(zOutput[0])&&c.includes(zOutput[2])){ // should be AND matching zOutput

//             // Check connection to next z
//             let nextNode = p2Inst.find((p)=>p[2]===c[3]||p[0]===c[3])

//             let zNode = p2Inst.find((p)=>nextNode[3]===p[2]||nextNode[3]===p[0])

//             if(zNode[3]!==`z${x[1]+1}`){
//                 //Don't think this is possible? but if so
//                 foundPairs.push(zNode[3])
//                 //do something else to find last node
//             }
//         } else { //Should be x or y XOR

//             if(c[1] !== 'XOR'){
//                 // Know opposite xy has wrong pair
//                 let match = p2Inst.find((p)=>p.join('')!==c.join('') && [p[0],p[2]].includes(c[0]))
//                 foundPairs.push(match[3],c[3])
//             }
//         }
//     }
// })


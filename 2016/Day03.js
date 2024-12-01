const fs = require('fs');
const input = fs.readFileSync('../2016/day3input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=>x.trim().split(/[\s]+/).map(Number))

// Part 1
let triangles = 0

lines.forEach(([s1,s2,s3])=>{
    if(s1<(s2+s3) && s2<(s1+s3) && s3<(s1+s2)){
        triangles++
    }
})

console.log(triangles)

// Part 2
let triangles2 = 0
for(i=0;i<3;i++){
    let col = lines.map((x)=>x[i])

    while(col.length>0){
        let [s1,s2,s3] = col.splice(0,3)
        if(s1<(s2+s3) && s2<(s1+s3) && s3<(s1+s2)){
            triangles2++
        }
    }
}

console.log(triangles2)
const crypto = require('crypto');

// Utils - inspired by https://github.com/Camelpilot33
Object.defineProperties(Array.prototype, {
    sum: { value: function (offset) { return this.map(Number).reduce((a, c) => a + c, offset||0); } },
    cumSum: { value: function (offset) { return this.map((sum = offset || 0, v => sum += v)); } },
    sorta: { value: function () { return this.map(Number).toSorted((a, b) => a - b); } },
    sortd: { value: function () { return this.map(Number).toSorted((a, b) => b - a); } },
    sort2a: { value: function (n) { return this.toSorted((a, b) => Number(a[n||0]) - Number(b[n||0])); } },
    sort2d: { value: function (n) { return this.toSorted((a, b) => Number(b[n||0]) - Number(a[n||0])); } },
    multiply: { value: function () { return this.reduce((a,b)=>a*b,1); } },
    col: { value: function (n) { return this.map((e)=>e[n]); } },
    transpose: { value: function () { return this[0].map((x,ix)=>this.map((y)=>y[ix])); } },
    counts: { value: function () { return this.reduce((a, c) => {return a[c] ? ++a[c] : a[c] = 1, a}, {}); } },
    chunks: { value: function (n) {let res = []; for (let i = 0; i < this.length; i += n) { res.push(this.slice(i, i + n)) } return res} },
    cartesian: { value: function () { const cart = (head, ...tail) => {let res = []; const rem = tail.length > 0 ? cart(...tail) : [[]];for (let r of rem) for (let h of head) res.push([h, ...r]); return res}; return cart(...this) } },
    mk2d: { value: function (re,toNum) { let r = re ? new RegExp(`${re}`,"g") : ''; return this.map((x)=>!toNum ? x.split(r) : x.split(r).map(Number)) } },
    mapkv: { value: function (toNum) { return this[0].length === 2 ? this.map((e)=> !toNum ? [e[0],e[1]] : [e[0],Number(e[1])]) : this.map((e)=>!toNum ? [e[0],e.slice(1)]: [e[0],e.slice(1).map(Number)]) } },
    atMod: { value: function (n,offset) {return this[(n+(offset||0))%this.length] } },
    pqShift: { value: function () {return this[this.findIndex((x)=>x.length>0)].shift() } },
    step4: { value: function (rowLen,colLen) {let rLen = rowLen || Infinity, cLen = colLen||Infinity,[r,c]=this; return [[r+1,c],[r-1,c],[r,c+1],[r,c-1]].filter(([nr,nc])=> 0 <= nr && nr <= rLen && 0 <= nc && nc <= cLen) } },
    step8: { value: function (rowLen,colLen) {let rLen = rowLen || Infinity, cLen = colLen||Infinity,[r,c]=this; return [[r+1,c],[r+1,c+1],[r,c+1],[r-1,c+1],[r-1,c],[r-1,c-1],[r,c-1],[r+1,c-1]].filter(([nr,nc])=> 0 <= nr && nr <= rLen && 0 <= nc && nc <= cLen) } },
  });

Object.defineProperties(String.prototype, {
    lines: {value: function (n) { let r = n || 1; return r === 1 ? this.split(/[\r\n]+/) : this.split(/\n\n/)} },
});

// Shoelace formula - taken from https://stackoverflow.com/questions/62323834/calculate-polygon-area-javascript
const shoelace = (coords) => {
  let area = 0;

  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];

    area += x1 * y2 - x2 * y1
  }

 return Math.abs(area) / 2;
}

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

const gcd = (a, b) => b == 0 ? a : gcd (b, a % b)
const lcm = (a, b) =>  a / gcd (a, b) * b

// const nextArr = ([r,c],grid,callback) => {
//   let next = [[r+1,c],[r,c+1],[r-1,c],[r,c-1]].filter(([nr,nc])=>grid[nr]?.[nc] !== undefined)
//   return !callback ? next : next.filter(callback)
// }

const nextArr = (coOrd,factor,grid,callback) => {
  let r,c
  //console.log('coOrd,factor',coOrd,factor)
  if(typeof coOrd === 'number'){
    //console.log('type is number')
    c = coOrd%factor
    r = (coOrd-c)/factor
    //console.log('r is ',r,' and c is ',c)

  } else {
    r = coOrd[0]
    c = coOrd[1]
  }

  let next = [[r-1,c],[r,c+1],[r+1,c],[r,c-1]].filter(([nr,nc])=> !callback ? grid[nr]?.[nc] !== undefined : grid[nr]?.[nc] !== undefined && callback([nr,nc]))
  //console.log('next is ',next)
  return typeof coOrd === 'number' ? next.map(([nr,nc])=>(nr*factor)+nc) : next
  //return !callback ? next : next.filter(callback)
}

const nextArr8 = ([r,c],grid,callback) => {
  let next = [[r+1,c],[r+1,c+1],[r,c+1],[r-1,c+1],[r-1,c],[r-1,c-1],[r,c-1],[r+1,c-1]].filter(([nr,nc])=>grid[nr]?.[nc] !== undefined)
  return !callback ? next : next.filter(callback)
}

module.exports = {
  shoelace, md5, gcd, lcm, nextArr,nextArr8
};
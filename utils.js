// Utils - inspired by https://github.com/Camelpilot33
Object.defineProperties(Array.prototype, {
    sum: { value: function (offset) { return this.map(Number).reduce((a, c) => a + c, offset||0); } },
    cumSum: { value: function (offset) { return this.map((sum = offset || 0, v => sum += v)); } },
    sorta: { value: function () { return this.toSorted((a, b) => a - b); } },
    sortd: { value: function () { return this.toSorted((a, b) => b - a); } },
    sort2a: { value: function (n) { return this.sort((a, b) => Number(a[n||0]) - Number(b[n||0])); } },
    sort2d: { value: function (n) { return this.sort((a, b) => Number(b[n||0]) - Number(a[n||0])); } },
    multiply: { value: function () { return this.map(Number).reduce((a, c) => a * c, 1); } },
    col: { value: function (n) { return this.map((e)=>e[n]); } },
    counts: { value: function () { return this.reduce((a, c) => {return a[c] ? ++a[c] : a[c] = 1, a}, {}); } },
    chunks: { value: function (n) {let res = []; for (let i = 0; i < this.length; i += n) { res.push(this.slice(i, i + n)) } return res} },
    cartesian: { value: function () { const cart = (head, ...tail) => {let res = []; const rem = tail.length > 0 ? cart(...tail) : [[]];for (let r of rem) for (let h of head) res.push([h, ...r]); return res}; return cart(...this) } },
    mk2d: { value: function (re,toNum) { let r = re ? new RegExp(`${re}`,"g") : ''; return this.map((x)=>!toNum ? x.split(r) : x.split(r).map(Number)) } },
    mapkv: { value: function (toNum) { return this[0].length === 2 ? this.map((e)=> !toNum ? [e[0],e[1]] : [e[0],Number(e[1])]) : this.map((e)=>!toNum ? [e[0],e.slice(1)]: [e[0],e.slice(1).map(Number)]) } },
    atMod: { value: function (n,offset) {return this[(n+(offset||0))%this.length] } },
  });
  
Object.defineProperties(String.prototype, {
    lines: {value: function (n) { let r = n || 1; return r === 1 ? this.split(/[\r\n]+/) : this.split(/\n\n/)} },
});


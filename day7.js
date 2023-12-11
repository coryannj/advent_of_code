const fs = require('fs');
const input = fs.readFileSync('../day7input.txt',{ encoding: 'utf8', flag: 'r' });

//Part 1

// Map for lexographical sorting
let score = '123456789TJQKA'
let adjustedscore = 'abcdefjklmnopq'

const allhands = input.split(/[\r\n]+/)
.map((x)=> {

  let hand = x.substring(0,5).split('').map((x) => adjustedscore[score.indexOf(x)]) // maps to letters so we can use lexographical sort e.g. 'KKKKK' -> 'ppppp'
  let bid = parseInt(x.substring(6))
  let handvalue
  
  // Work out what poker hand it is - use Set to minimise need to count chars
  // After we work out what hand - prepend value based on hand rank from 1-7 so when we sort array it's doing hand strength AND first/second/third chars etc all in one go e.g. '11111' will end up as '7aaaaa'

  let handset = new Set(hand)

  if (handset.size === 1) {
    handvalue = '7'.concat(hand.join('')) // Five of a kind
  } else if (handset.size === 5) {
    handvalue = '1'.concat(hand.join('')) // High card
  } else if (handset.size === 4) {
    handvalue = '2'.concat(hand.join('')) // One pair
  } else if (handset.size === 2) {
    if (hand.toSorted().join('').match(/([^])\1{3}/g) != null) {
      handvalue = '6'.concat(hand.join('')) // Four of a kind
    } else {
      handvalue = '5'.concat(hand.join('')) // Full house
    }
  } else if (handset.size === 3) {
    if (hand.toSorted().join('').match(/([^])\1{2}/g) != null) {
      handvalue = '4'.concat(hand.join('')) // Three of a kind
    } else {
      handvalue = '3'.concat(hand.join('')) // Two pair
    }
  }
  return [handvalue,bid]
})
.sort((a,b) => {return a[0] === b[0] ? 0 : a[0]< b[0] ? -1 : returnval=1}) // Sorts rank by hand
.reduce((acc,curr,index) => acc + ((index+1)*curr[1]),0) // Sums rank * bid
console.log(allhands)

// Part 2

// Map for lexographical sorting - changing for J
let scorepart2 = 'J123456789TQKA'
let adjustedscorepart2 = 'abcdefjklmnopq'

const allhandspart2 = input.split(/[\r\n]+/)
.map((x)=> {

  let hand = x.substring(0,5).split('').map((x) => adjustedscorepart2[scorepart2.indexOf(x)]) // maps to corr. letter
  let bid = parseInt(x.substring(6))
  let handvalue
  
  // Work out what poker hand it is - use Set to minimise need to count chars
  // After we work out what hand - prepend value based on hand rank from 1-7 so when we sort array it's doing hand strength AND first/second/third chars etc all in one go e.g. '11111' will end up as '7aaaaa'

  let handset = new Set(hand)
  let notjset = new Set(hand.filter((x) => x !== 'a'))
  let jcount = hand.toSorted().join('').match(/\a+/g)

  if (handset.size === 1 || notjset.size === 1) {
    handvalue = 7 // Five of a kind
  } else if (handset.size === 5) {
    handvalue = 1 // High card
    if (jcount !== null) {handvalue++} // High card -> One pair if J found
  } else if (handset.size === 4) {
    handvalue = 2 // One pair
    if (jcount !== null) {handvalue=handvalue+2} // One pair -> 3 of a kind if J found
  } else if (handset.size === 2) {
    if (hand.toSorted().join('').match(/([^])\1{3}/g) != null) {
      handvalue = 6 // Four of a kind - J not possible in this if block
    } else {
      handvalue = 5 // Full house - J not possible in this if block
    }
  } else if (handset.size === 3) {
    if (hand.toSorted().join('').match(/([^])\1{2}/g) != null) {
      handvalue = 4 // Three of a kind
      if (jcount !== null) {handvalue=handvalue+2} // Three of a kind => Four of a kind if J found
    } else {
      handvalue = 3; // Two pair
      if (jcount !== null) {
        if(jcount[0].length === 2) {
          handvalue=handvalue+3 // Two pair -> Four of a kind if two Jacks
        } else {
          handvalue=handvalue+2 // Two pair -> Full house if one J
        } 
      }      
    }
  }
  return [handvalue+hand.join(''),bid]
})
.sort((a,b) => {return a[0] === b[0] ? 0 : a[0]< b[0] ? -1 : returnval=1}) // Sorts by hand then rank
.reduce((acc,curr,index) => acc + ((index+1)*curr[1]),0) // Sums rank * bid
console.log(allhandspart2)
const fs = require('fs');
const input = fs.readFileSync('../day7input.txt',{ encoding: 'utf8', flag: 'r' });
const hands = input.split(/[\r\n]+/)

// Map to enable lexographical sorting - each hand will end up as `${Prepend with hand rank}${p1rank -> p1adjusted mapping}`
const p1rank = '123456789TJQKA'
const p1adjusted = 'abcdefjklmnopq'
const p2rank = 'J123456789TQKA'
const p2adjusted = 'abcdefjklmnopq'

const handRegex = /(.)\1*/g // Get all individual groups in string with length of that card e.g. 'TTTJJ' -> ['TTT','JJ']

function getHand (hand,p1orp2) {
    let handMap, jokers, ranking, handRank;

    if (p1orp2 === 'part1') {
        handMap = hand.split('').map((card)=> p1adjusted.charAt(p1rank.indexOf(card))); // '12345' -> 'abcde'
    } else {
        handMap = hand.split('').map((card)=> p2adjusted.charAt(p2rank.indexOf(card)));
    }
    
    handRank = handMap.toSorted().join('').match(handRegex); // 'ababa' -> ['aaa','bb'] 

    if (handRank.length === 1) {
      ranking = 7 // Five of a kind
    } else {
      p1orp2 === 'part2' && hand.includes('J') ? jokers = handRank.shift() : '' // For part 2 - separate jokers

      var countCard = handRank.map((x)=> x.length).sort().reverse(); // Map to number of each card found & sort desc e.g. ['TT','J','KK'] => [2,2,1]

      jokers !== undefined ? countCard[0]+=jokers.length : '' // add count of jokers to most common card

      switch (true) {
         case (countCard.length === 5):
            ranking = 1 // High card
            break;
         case (countCard.length === 4):
            ranking = 2 // One pair 
            break;
         case (countCard.indexOf(2) !== countCard.lastIndexOf(2)):
            ranking = 3 // Two pair 
            break;
         case (countCard.includes(3) && !countCard.includes(2)):
            ranking = 4 // 3 of a kind
            break;
         case (countCard.includes(3) && countCard.includes(2)):
            ranking = 5 // Full house
            break;
         case (countCard.includes(4)):
            ranking = 6 // Four of a kind
            break;
      }
    }

  return `${ranking}${handMap.join('')}` // 'KKKKK' => '7ppppp' 
}

//Part 1 and Part 2
let p1array = [], p2array = []

hands.forEach((thisHand)=>{
   let [cards,bid] = thisHand.split(' ');
   p1array.push([getHand(cards,'part1'),parseInt(bid)]);
   p2array.push([getHand(cards,'part2'),parseInt(bid)]);
}) 

console.log(p1array.sort((a,b)=>a[0].localeCompare(b[0]))
.map((rank,ridx)=>rank[1]*(ridx+1))
.reduce((acc,curr)=>acc+curr)) // Part 1 answer

console.log(p2array.sort((a,b)=>a[0].localeCompare(b[0]))
.map((rank,ridx)=>rank[1]*(ridx+1))
.reduce((acc,curr)=>acc+curr)) // Part 2 answer
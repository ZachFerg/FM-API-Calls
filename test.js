// let myArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// let result = [], i;
// for (i = 0; i < myArray.length; i += 4) { // adding 4 each time
//     result.push([myArray[i], myArray[i + 1], myArray[i + 2], myArray[i + 3]]);
// }
// // then if you have length !== 0 mod 4, work backwards
// while ((i = result.length - 1) * 4 + result[i].length > myArray.length)
//      result[i].pop(); // removing items from the end
// result; // [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9]]


// function* chunks(arr, n) {
//     for (let i = 0; i < arr.length; i += n) {
//       yield arr.slice(i, i + n);
//     }
//   }
  
//   let someArray = [0,1,2,3,4,5,6,7,8,9]
//   console.log([...chunks(someArray, 4)])

let arr = [
  {type:"orange", title:"First"},
  {type:"orange", title:"Second"},
  {type:"banana", title:"Third"},
  {type:"banana", title:"Fourth"}
];

const data = [
  { idorders: 192, batchID: 101003, batchSequence: 1 },
  { idorders: 193, batchID: 101003, batchSequence: 2 },
  { idorders: 194, batchID: 101003, batchSequence: 3 },
  { idorders: 195, batchID: 101003, batchSequence: 4 },
  { idorders: 197, batchID: 101003, batchSequence: 5 },
  { idorders: 198, batchID: 101003, batchSequence: 6 },
  { idorders: 199, batchID: 101003, batchSequence: 7 },
  { idorders: 200, batchID: 101003, batchSequence: 8 },
  { idorders: 201, batchID: 101003, batchSequence: 9 },
  { idorders: 202, batchID: 101003, batchSequence: 10 },
  { idorders: 203, batchID: 101003, batchSequence: 11 },
  { idorders: 204, batchID: 101003, batchSequence: 12 },
  { idorders: 205, batchID: 101003, batchSequence: 13 },
  { idorders: 206, batchID: 101003, batchSequence: 14 },
  { idorders: 207, batchID: 101003, batchSequence: 15 },
  { idorders: 208, batchID: 101003, batchSequence: 16 },
  { idorders: 209, batchID: 101003, batchSequence: 17 },
  { idorders: 210, batchID: 101003, batchSequence: 18 },
  { idorders: 211, batchID: 101003, batchSequence: 19 },
  { idorders: 212, batchID: 101003, batchSequence: 20 },
  { idorders: 213, batchID: 101003, batchSequence: 21 },
  { idorders: 214, batchID: 101003, batchSequence: 22 },
  { idorders: 215, batchID: 101003, batchSequence: 23 },
  { idorders: 216, batchID: 101003, batchSequence: 24 },
  { idorders: 217, batchID: 101003, batchSequence: 25 },
  { idorders: 218, batchID: 101003, batchSequence: 26 },
  { idorders: 219, batchID: 101003, batchSequence: 27 },
  { idorders: 220, batchID: 101003, batchSequence: 28 },
  { idorders: 221, batchID: 101003, batchSequence: 29 },
  { idorders: 222, batchID: 101003, batchSequence: 30 },
  { idorders: 223, batchID: 101003, batchSequence: 31 },
  { idorders: 224, batchID: 101003, batchSequence: 32 },
  { idorders: 225, batchID: 101003, batchSequence: 33 },
  { idorders: 226, batchID: 101003, batchSequence: 34 },
  { idorders: 227, batchID: 101003, batchSequence: 35 },
  { idorders: 228, batchID: 101003, batchSequence: 36 },
  { idorders: 229, batchID: 101003, batchSequence: 37 },
  { idorders: 230, batchID: 101003, batchSequence: 38 },
  { idorders: 231, batchID: 101003, batchSequence: 39 },
  { idorders: 232, batchID: 101004, batchSequence: 1 },
  { idorders: 233, batchID: 101004, batchSequence: 2 },
];

function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) { memo[x[property]] = []; }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

let a = groupBy(data, 'batchID')
console.log(a[101004])

//   const objArray = [{foo: 1, bar: 2}, {foo: 3, bar: 4}, {foo: 5, bar: 6}]
//   let idArray = objArray.map(({ foo }) => foo)

let whatevs = a[101004].map(a => a.batchID)
console.log(whatevs)

//   console.log(idArray)
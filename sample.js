const axios = require('axios');
const axiosRetry = require('axios-retry');

// async function test1() {
//   const todoIdList = [1, 2, 3, 4];
//   console.time('.map()');
//   await Promise.all(
//     todoIdList.map(async (id) => {
//       const response = await fetch(
//         `https://jsonplaceholder.typicode.com/todos/${id}`,
//       );
//       const todo = await response.json();
//       console.log(todo.title);
//     }),
//   );
//   console.timeEnd('.map()');
// }

// async function test2() {
//   const todoIdList = [1, 2, 3, 4];
//   console.time('for {}');
//   for (const id of todoIdList) {
//     const response = await fetch(
//       `https://jsonplaceholder.typicode.com/todos/${id}`,
//     );
//     const todo = await response.json();
//     console.log(todo.title);
//   }
//   console.timeEnd('for {}');
// }
console.log('hi roger');
// test1();
// test2();

async function axiosRetryThing() {
  axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: (retryCount) => {
      console.log(`retry attempt: ${retryCount}`);
      return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error) => {
      // if retry condition is not specified, by default idempotent requests are retried
      return error.response.status === 503;
    },
  });

  const response = await axios({
    method: 'GET',
    url: 'https://httpstat.us/503',
  }).catch((err) => {
    console.log(err);
    // if (err.response.status !== 200) {
    //   throw new Error(
    //     `API call failed with status code: ${err.response.status} after 3 retry attempts`,
    //   );
    // }
  });
}

axiosRetryThing();

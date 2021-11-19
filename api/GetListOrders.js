require('dotenv').config({ path: '../.ENV' });
const axios = require('axios');
const axiosRetry = require('axios-retry');
const fs = require('fs');
const path = require('path');
const { formatDate } = require('../helpers/formatFunctions');

const today = new Date();
const yesterday = new Date(today);
const day_before = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);
day_before.setDate(day_before.getDate() - 2);

const fm_yesterday = formatDate(yesterday);
const fm_day_before = formatDate(day_before);

const param_url = new URL(
  `https://api.fotomerchanthv.com/orders?limit=100&type=all&orderDir=ASC&`,
);

const params = { from: fm_day_before, to: fm_yesterday };
Object.keys(params).forEach((key) =>
  param_url.searchParams.append(key, params[key]),
);

const config = {
  method: 'get',
  headers: {
    Authorization: process.env.FM_API_KEY,
  },
};

// console.log(param_url.href);

async function getAllOrderIds() {
  console.log('Starting Get List Orders call.....');

  let repo = null;
  page_count = 1;
  results = [];

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

  do {
    try {
      repo = await axios(
        `${param_url.href}&page=${page_count++}`,
        config,
      ).catch((err) => {
        console.log(err);
      });

      const orderIDList = repo.data.orders.reduce(
        (orderIDList, { id }, i) => {
          orderIDList.push(id);
          return orderIDList;
        },
        [],
      );

      results = results.concat(orderIDList);
      console.log(repo.data.paging);
      // console.log(results.length);
    } catch (err) {
      console.log(err);
    }
  } while (repo.data.paging.page < repo.data.paging.last);
  return results;
}

// async function gatherAllIDs(data) {
//   const orderIDList = [];
//   try {
//     data.forEach(function (order) {
//       orderIDList.push(order.id);
//     });
//     return orderIDList;
//   } catch (err) {
//     console.error(err);
//   }
//   console.log(orderIDList);
// }

async function writeToFile(array) {
  const today = formatDate(new Date());
  const __dirname = path.resolve();
  const writeStream = fs.createWriteStream(
    __dirname + `/ordertexts/${today}-orderIDs.txt`,
  );
  const pathName = writeStream.path;

  // write each value of the array on the file breaking line
  array.forEach((value) => writeStream.write(`${value}\n`));

  // the finish event is emitted when all data has been flushed from the stream
  writeStream.on('finish', () => {
    console.log(`wrote all the array data to file ${pathName}`);
  });

  writeStream.on('error', (err) => {
    console.error(
      `There is an error writing the file ${pathName} => ${err}`,
    );
  });

  // close the stream
  writeStream.end();
}

async function sendOrderList() {
  let data = await getAllOrderIds();
  // let orderIDList = await gatherAllIDs(data);
  // let orderIDList = await gatherAllIDs(data);
  await writeToFile(data);
  return data;
}

// module.exports = { getAllOrderIds, gatherAllIDs, sendOrderList };
module.exports = { getAllOrderIds, sendOrderList };

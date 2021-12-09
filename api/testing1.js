require('dotenv').config({ path: '../.ENV' });
const axios = require('axios');
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

axios.defaults.headers.common['Authorization'] =
  process.env.FM_API_KEY;

const generatePageArray = (n) =>
  [...new Array(n)].map((item, i) => i + 1);

const orderList = generatePageArray(103);

function fetchOrderList(pageNum) {
  const param_url = new URL(
    `https://api.fotomerchanthv.com/orders?limit=100&type=all&orderDir=ASC&page=${pageNum}`,
  );

  const params = { from: fm_day_before, to: fm_yesterday };
  Object.keys(params).forEach((key) =>
    param_url.searchParams.append(key, params[key]),
  );

  console.log(param_url.href);

  return axios
    .get(param_url.href)
    .then((res) => (orderIDs = extractIDs(res.data.orders)));
}

async function fetchAndLog(pageNum) {
  let success = false;
  let result = [];
  do {
    try {
      let orderList = await fetchOrderList(pageNum);
      console.log(`page num ${pageNum} success`);
      result.push(orderList);
      success = true;
    } catch (e) {
      console.log(`page num ${pageNum} fail`);
    }
  } while (!success);
  return result;
}

/**
 *
 * @param {array} items
 * @param {function} fn
 * @returns
 */
function all(items, fn) {
  const promises = items.map((item) => fn(item));
  return Promise.all(promises);
}

function series(items, fn) {
  let result = [];
  return items
    .reduce((acc, item) => {
      acc = acc.then(() => {
        return fn(item).then((res) => result.push(res));
      });
      return acc;
    }, Promise.resolve())
    .then(() => result);
}

function splitToChunks(items, chunkSize = 5) {
  const result = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize));
  }
  return result;
}

function chunks(items, fn, chunkSize = 5) {
  let result = [];
  const chunks = splitToChunks(items, chunkSize);
  return series(chunks, (chunk) => {
    return all(chunk, fn).then(
      (res) => (result = result.concat(res)),
    );
  }).then(() => writeToFile(result));
}

function extractIDs(data) {
  const orderIDList = data.reduce((orderIDList, { id }, i) => {
    orderIDList.push(id);
    return orderIDList;
  }, []);
  return orderIDList;
}

function writeToFile(array) {
  const today = formatDate(new Date());
  const __dirname = path.resolve();
  const writeStream = fs.createWriteStream(
    __dirname + `/${today}-orderIDs.txt`,
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

const testing = chunks(orderList, fetchAndLog);

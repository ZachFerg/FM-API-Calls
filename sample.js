const axios = require('axios');
require('dotenv').config();
const orderList = require('./api/orderList');

axios.defaults.headers.common['Authorization'] =
  process.env.FM_API_KEY;

function processOrders(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    // take all this crap and rewrite it into a function we can pass here that returns payload
    const orderID = data[i]?.order?.id ?? null;
    const _fknShootNumber =
      data[i]?.order?.clientSession?.externalReference ?? null;
    const _fktCustomerNo =
      data[i]?.order?.clientSession?.client?.externalReference ??
      null;
    const customerName = data[i]?.order?.recipientName ?? null;
    const emailAddress = data[i]?.order?.recipientEmail ?? null;

    const finalPayload = {
      orderID: orderID,
      _fknShootNumber: _fknShootNumber,
      _fktCustomerNo: _fktCustomerNo,
      customerName: customerName,
      emailAddress: emailAddress,
    };
    result.push(finalPayload);
  }

  return result;
}

function fetchOrder(order_id) {
  const url = `https://api.fotomerchanthv.com/orders/${order_id}/lab`;
  return axios.get(url).then((res) => res.data);
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

function splitToChunks(items, chunkSize = 50) {
  const result = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize));
  }
  return result;
}

function chunks(items, fn, chunkSize = 50) {
  let result = [];
  const chunks = splitToChunks(items, chunkSize);
  return series(chunks, (chunk) => {
    console.log(chunk);
    return all(chunk, fn)
      .then((res) => (data = processOrders(res)))
      .then((data) => postToDB(data));
  }).then(() => console.log('done!'));
}

function postToDB(payload) {
  const url = `http://localhost:5000/api/orders/orders/`;
  return axios
    .post(url, payload)
    .then((res) => console.log(res.data));
}

const testing = chunks(orderList, fetchOrder);

require('dotenv').config({ path: '../.ENV' });
const axios = require('axios');

/**
 *
 * @param {string} date - date string
 * @returns {string} date - yyyy-mm-dd syntax
 */
function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function objectLength(obj) {
  let result = 0;
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      result++;
    }
  }
  return result;
}

/**
 *
 * @returns {array} res.data - response object from endpoint
 */
async function pullOrders() {
  const today = formatDate(Date.now());
  //   const today = '2021-09-24';
  //   console.log(today);

  try {
    let res = await axios.get(
      `http://localhost:5000/api/orders/getOrders/${today}`,
    );
    if (res.status == 200) {
      console.log(res.data.length + ' Orders pulled for today');
    }
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

/**
 *
 * @param {array} orders - the response object from pullOrders()
 * @param {number} threshold - the limit the paperLength can't exceed
 * @returns {array} batchArr - array of objects containing batch data
 */
async function setBatches(orders, threshold) {
  let i;
  let totalBatchLength = 0;
  let batchSequence = 1;
  let batchID = (await getBatchID()) + 1;
  console.log(batchID);
  let newArr = [];
  let batchArr = [];

  for (i = 0; i < orders.length; i++) {
    if (i < orders.length && totalBatchLength < threshold) {
      totalBatchLength += orders[i].paperLength;
      newArr.push({
        idorders: orders[i].idorders,
        orderID: orders[i].orderID,
        batchID: batchID,
        batchSequence: batchSequence,
        totalBatchLength: totalBatchLength,
        batchCategory: orders[i].batchCategory,
      });
      batchSequence += 1;
    } else {
      totalBatchLength = 0;
      totalBatchLength += orders[i].paperLength;
      batchArr.push(...newArr);
      newArr.length = 0;
      batchSequence = 1;
      batchID += 1;
      newArr.push({
        idorders: orders[i].idorders,
        orderID: orders[i].orderID,
        batchID: batchID,
        batchSequence: batchSequence,
        totalBatchLength: totalBatchLength,
        batchCategory: orders[i].batchCategory,
      });
      batchSequence += 1;
    }
  }
  batchArr.push(...newArr);
  return batchArr;
}

/**
 *
 * @returns {Number} batchNum - last Batch Id returned from DB
 */
async function getBatchID() {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/batches/batches/getBatchID',
    );
    let batchNum = response.data[0].batchNumber;
    return parseInt(batchNum);
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 * @param {array} batchArr - array returned from setBatches()
 * @returns {array} updatedOrders - cleaned object for SQL injection
 */
async function cleanOrderObj(batchArr) {
  let updatedOrders = [];
  for (let i = 0; i < batchArr.length; i++) {
    try {
      const orderPayload = {
        idorders: batchArr[i].idorders,
        batchID: batchArr[i].batchID,
        batchSequence: batchArr[i].batchSequence,
      };
      updatedOrders.push(orderPayload);
    } catch (err) {
      console.log(err);
    }
  }
  return updatedOrders;
}

async function updateOrdersTable(Arr) {
  const param_url = new URL(
    `http://localhost:5000/api/orders/orders/`,
  );

  const config = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    for (let i = 0; i < Arr.length; i++) {
      repo = await axios.put(
        `${param_url.href}${Arr[i].idorders}`,
        Arr[i],
        config,
      );
    }
  } catch (err) {
    console.error(err);
  }
}

async function sendBatchInfo(arr) {
  let results = [];
  for (const batchID in arr) {
    // console.log(batchID);
    const fmResult = await makeAPIBatchCall(arr[batchID]);
    results = results.concat(fmResult);
  }
  return results;
}

async function makeAPIBatchCall(arr) {
  let idArray = arr.map(({ orderID }) => orderID); // grabs all order ID's from current array

  let fmPayload = {
    batchJob: {
      orders: idArray,
      sortOrder: [
        {
          direction: 'desc',
          property: 'orders.id',
        },
      ],
      sendTo: 'ship_to_address',
      shippingMethod: '01FCYX3QCC4WNY6727PWTSCGCS',
      address: {
        name: 'Strawbridge Studios',
        phone: '+1 800 326 9080',
        address1: '13616 Hillsborough Rd',
        zipCode: '27705',
        city: 'Durham',
        country: 'US',
        state: 'US-NC',
      },
    },
  };

  let param_url = new URL(
    `https://api.staging.fotomerchanthv.com/batch_jobs`,
  );

  const config = {
    method: 'post',
    url: param_url.href,
    data: fmPayload,
    headers: {
      Authorization: process.env.FM_STAGE_API_KEY,
    },
  };

  try {
    let res = await axios(config);
    if (res.status == 200) {
      console.log('Batch Call successful...');
    }
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

/**
 *
 * @param {array} arr - Array of batches
 * @param {string} property - what you want to group by
 * @returns
 */
async function groupBy(arr, property) {
  return arr.reduce(function (memo, x) {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

async function updateBatchTable(results, fmBatchInfo) {
  const batchInfo = [];
  const fmBatchRef = [];
  const batchLengthInfo = [];

  let fmObjcount = objectLength(fmBatchInfo);

  const paperSurface = 'Glossy';
  const paperWidth = 10;
  const envelopeType = 'UC';
  const shipMethod = 'S2H';
  const retouch = 1;
  const retouchQC = 1;

  for (let i = 0; i < fmObjcount; i++) {
    let fmBatchId = fmBatchInfo[i].batchJobs[0].batchReference;
    fmBatchRef.push(fmBatchId);
  }

  const resultKeys = Object.keys(results);

  for (let y = 0; y < resultKeys.length; y++) {
    totalBatchLength =
      results[resultKeys[y]][
        Object.keys(results[resultKeys[y]]).length - 1
      ].totalBatchLength;
    batchLengthInfo.push(totalBatchLength);
  }

  let zip = (rows) =>
    rows[0].map((_, c) => rows.map((row) => row[c]));

  let zipped = zip([resultKeys, fmBatchRef, batchLengthInfo]);

  for (let b = 0; b < zipped.length; b++) {
    const batchPayload = {
      batchNumber: zipped[b][0],
      fmBatchId: zipped[b][1],
      paperSurface: paperSurface,
      paperWidth: paperWidth,
      batchLength: zipped[b][2],
      envelopeType: envelopeType,
      shipMethod: shipMethod,
      recQC: 1,
      preRipQC: 1,
      postRipQC: 1,
      retouch: retouch,
      retouchQC: retouchQC,
    };
    batchInfo.push(batchPayload);
  }

  const param_url = new URL(
    `http://localhost:5000/api/batches/batches/`,
  );

  const config = {
    method: 'post',
    url: param_url.href,
    body: batchInfo,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    for (let i = 0; i < batchInfo.length; i++) {
      repo = await axios.post(param_url.href, batchInfo[i], config);
    }
  } catch (err) {
    console.error(err);
  }
}

async function buildBatchLogic() {
  let orders = await pullOrders(); // step 1
  let batches = await setBatches(orders, 800); // step 2 & 3
  let cleanedData = await cleanOrderObj(batches);
  updateOrdersTable(cleanedData);
  let batchingGroup = await groupBy(batches, 'batchID');
  // console.log(batchingGroup)
  let batchInfo = await sendBatchInfo(batchingGroup);
  //   console.log(batchInfo)
  updateBatchTable(batchingGroup, batchInfo);
}

buildBatchLogic();

require('dotenv').config({ path: '../.ENV' });
const axios = require('axios');

axios.defaults.headers.common['User-Agent'] =
  'Strawbridge-Automation/1.0';

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

/**
 * finds the amount of objects in an object
 * @param {object} obj
 * @returns
 */
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
async function pullOrders(batchCategory) {
  const today = formatDate(Date.now());
  // console.log(today);

  try {
    let res = await axios.get(
      `http://localhost:5000/api/orders/getOrders/${today}/${batchCategory}`,
    );
    if (res.status == 200) {
      console.log(res.data.length + ' Orders pulled for today');
    }
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

// /**
//  *
//  * @param {array} orders - the response object from pullOrders()
//  * @param {number} threshold - the limit the paperLength can exceed
//  * @returns {array} batchArr - array of objects containing batch data
//  */
// async function setBatches(orders, threshold) {
//   let i;
//   let totalBatchLength = 0;
//   let batchSequence = 1;
//   let batchID = (await getBatchID()) + 1;
//   console.log(batchID);
//   let newArr = [];
//   let batchArr = [];

//   for (i = 0; i < orders.length; i++) {
//     if (i < orders.length && totalBatchLength < threshold) {
//       totalBatchLength += orders[i].paperLength;
//       newArr.push({
//         idorders: orders[i].idorders,
//         orderID: orders[i].orderID,
//         batchID: batchID,
//         batchSequence: batchSequence,
//         totalBatchLength: totalBatchLength,
//         batchCategory: orders[i].batchCategory,
//       });
//       batchSequence += 1;
//     } else {
//       totalBatchLength = 0;
//       totalBatchLength += orders[i].paperLength;
//       batchArr.push(...newArr);
//       newArr.length = 0;
//       batchSequence = 1;
//       batchID += 1;
//       newArr.push({
//         idorders: orders[i].idorders,
//         orderID: orders[i].orderID,
//         batchID: batchID,
//         batchSequence: batchSequence,
//         totalBatchLength: totalBatchLength,
//         batchCategory: orders[i].batchCategory,
//       });
//       batchSequence += 1;
//     }
//   }
//   batchArr.push(...newArr);
//   return batchArr;
// }

/**
 * Using this until paperLength is fixed
 * @param {array} orders - the response object from pullOrders()
 * @param {number} orderThreshold - the amount of orders we can exceed
 * @returns {array} batchArr - array of objects containing batch data
 */
async function setBatchesBandAid(orders, orderThreshold) {
  let i;
  let totalBatchLength = 0;
  let orderTotalLength = 0;
  let batchSequence = 1;
  let batchID = (await getBatchID()) + 1;
  let newArr = [];
  let batchArr = [];

  for (i = 0; i < orders.length; i++) {
    if (i < orders.length && orderTotalLength < orderThreshold) {
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
      orderTotalLength += 1;
    } else {
      totalBatchLength = 0;
      orderTotalLength = 0;
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
      orderTotalLength += 1;
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
  // add error handling here
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
    const fmResult = await makeAPIBatchCall(arr[batchID]);
    results = results.concat(fmResult);
  }
  return results;
}

async function makeAPIBatchCall(arr) {
  // grabs all order ID's from current array
  let idArray = arr.map(({ orderID }) => orderID);

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
      shippingMethod: '01FJX2KDX7RGNNEYJG4CV3NY84',
      address: {
        name: 'Strawbridge Studios',
        phone: '+1 800 326 9080',
        address1: '3616 Hillsborough Rd',
        zipCode: '27705',
        city: 'Durham',
        country: 'US',
        state: 'US-NC',
      },
    },
  };

  let param_url = new URL(
    `https://api.fotomerchanthv.com/batch_jobs`,
  );

  const config = {
    method: 'post',
    url: param_url.href,
    data: fmPayload,
    headers: {
      Authorization: process.env.FM_API_KEY,
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

/**
 * Takes the results from Fotomerchant, combines with the
 * batch information set by Strawbridge, and posts to the DB.
 * @param {object} results
 * @param {object} fmBatchInfo
 */
async function updateBatchTable(results, fmBatchInfo) {
  const batchInfo = [];
  const fmBatchRef = [];
  const batchLengthInfo = [];
  const resultKeys = Object.keys(results);

  let fmObjcount = objectLength(fmBatchInfo) ?? 0;
  const batchCat =
    results[resultKeys[0]][Object.keys(results[resultKeys[0]])[0]]
      .batchCategory;

  async function setRetouching(batchCat) {
    if (
      batchCat === 'Automation Retouch' ||
      batchCat === 'Automation Novelty Retouch'
    ) {
      retouch = 1;
      retouchQC = 1;
    } else {
      retouch = 0;
      retouchQC = 0;
    }
    return [retouch, retouchQC];
  }

  async function setRipType(batchCat) {
    if (
      batchCat === 'Automation Novelty' ||
      batchCat === 'Automation Novelty Retouch'
    ) {
      ripType = 'Novelty';
    } else {
      ripType = 'Underclass';
    }
    return ripType;
  }

  // fields for DB creation
  const recQC = 1;
  const xmlQC = 1;
  const preRipQC = 1;
  const postRipQC = 1;
  let retouchConfig = await setRetouching(batchCat);
  retouch = retouchConfig[0];
  retouchQC = retouchConfig[1];

  const paperSurface = 'Glossy';
  const paperWidth = 10;
  const envelopeType = 'UC';
  const shipMethod = 'S2H';
  ripType = await setRipType(batchCat);
  const currentStage = 'Batch Requested';
  const batchCreationTimestamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  for (let i = 0; i < fmObjcount; i++) {
    let fmBatchId =
      fmBatchInfo[i]?.batchJobs[0]?.batchReference ?? 'fill in';
    fmBatchRef.push(fmBatchId);
  }

  // adds up the length of all orders in a batch
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
      recQC: recQC,
      xmlQC: xmlQC,
      preRipQC: preRipQC,
      postRipQC: postRipQC,
      retouch: retouch,
      retouchQC: retouchQC,
      batchCreationTimestamp: batchCreationTimestamp,
      currentStage: currentStage,
      ripType: ripType,
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

async function buildBatchLogicAutomation() {
  let orders = await pullOrders('Automation');
  if (orders.length == 0) {
    console.log('No orders containing Automation');
    return;
  }
  // let batches = await setBatches(orders, 100); // <- Set threshold here
  let batches = await setBatchesBandAid(orders, 100);
  let cleanedData = await cleanOrderObj(batches);
  await updateOrdersTable(cleanedData);
  let batchingGroup = await groupBy(batches, 'batchID');
  let batchInfo = await sendBatchInfo(batchingGroup);
  await updateBatchTable(batchingGroup, batchInfo);
}

async function buildBatchLogicAutomationRetouch() {
  let orders = await pullOrders('Automation Retouch');

  if (orders.length == 0) {
    console.log('No orders containing Automation Retouch');
    return;
  }
  // let batches = await setBatches(orders, 100); // <- Set threshold here
  let batches = await setBatchesBandAid(orders, 100);
  let cleanedData = await cleanOrderObj(batches);
  await updateOrdersTable(cleanedData);
  let batchingGroup = await groupBy(batches, 'batchID');
  let batchInfo = await sendBatchInfo(batchingGroup);
  await updateBatchTable(batchingGroup, batchInfo);
}

async function buildBatchLogicAutomationNovelty() {
  let orders = await pullOrders('Automation Novelty');
  if (orders.length == 0) {
    console.log('No orders containing Automation Novelty');
    return;
  }
  // let batches = await setBatches(orders, 100); // <- Set threshold here
  let batches = await setBatchesBandAid(orders, 100);
  let cleanedData = await cleanOrderObj(batches);
  await updateOrdersTable(cleanedData);
  let batchingGroup = await groupBy(batches, 'batchID');
  let batchInfo = await sendBatchInfo(batchingGroup);
  await updateBatchTable(batchingGroup, batchInfo);
}

async function buildBatchLogicAutomationNoveltyRetouch() {
  let orders = await pullOrders('Automation Novelty Retouch');
  if (orders.length == 0) {
    console.log('No orders containing Automation Novelty Retouch');
    return;
  }
  // let batches = await setBatches(orders, 100); // <- Set threshold here
  let batches = await setBatchesBandAid(orders, 100);
  let cleanedData = await cleanOrderObj(batches);
  await updateOrdersTable(cleanedData);
  let batchingGroup = await groupBy(batches, 'batchID');
  let batchInfo = await sendBatchInfo(batchingGroup);
  await updateBatchTable(batchingGroup, batchInfo);
}

async function doAllBatches() {
  await buildBatchLogicAutomationNoveltyRetouch();
  await buildBatchLogicAutomationNovelty();
  await buildBatchLogicAutomationRetouch();
  await buildBatchLogicAutomation();
}

module.exports = { doAllBatches };

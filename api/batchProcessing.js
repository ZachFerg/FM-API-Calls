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

/**
 *
 * @returns {array} res.data - response object from endpoint
 */
async function pullOrders() {
  const today = formatDate(Date.now());
  console.log(today);

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
  let batchID = await getBatchID();
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

// Step 4
function sendBatchInfo() {
  // Send response to FM api call
  // parse through response, grab certain info
}

// Step 5
function updateBatchTable() {
  /*
    paperSurface` needs to be set to "Glossy
    paperWidth` needs to be set to 10
    batchLength` needs to be set (decimal)
    envelopeType` needs to be set to "UC
    shipMethod` needs to be set to "S2H"
    */
  const paperSurface = 'Glossy';
  const paperWidth = 10;
  const batchLength = 0; // what is batchLength?
  const envelopeType = 'UC';
  const shipMethod = 'S2H';

  const batchPayload = {
    batchID: batchArr[i].batchID,
    fmBatchId: fmBatchId,
    paperSurface: paperSurface,
    paperWidth: paperWidth,
    batchLength: batchLength,
    envelopeType: envelopeType,
    shipMethod: shipMethod,
  };
}

async function buildBatchLogic() {
  let orders = await pullOrders(); // step 1
  let batches = await setBatches(orders, 2000); // step 2 & 3
  let cleanedData = await cleanOrderObj(batches);
  // updateOrdersTable(cleanedData)
}

// buildBatchLogic()

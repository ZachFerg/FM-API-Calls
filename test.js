// const data = {
//     "batchJobs": [
//         {
//             "type": "order_distribution_df",
//             "batchReference": "B21-105-6D330Z",
//             "state": "STATE_QUEUED_FOR_PROCESSING",
//             "shippingAddress": {
//                 "name": "Strawbridge Studios",
//                 "firstName": "Strawbridge",
//                 "lastName": "Studios",
//                 "phone": "18003269080",
//                 "address1": "13616 Hillsborough Rd",
//                 "city": "Durham",
//                 "zipCode": "27705",
//                 "state": "US-NC",
//                 "stateLabel": "NC",
//                 "country": "US",
//                 "countryLabel": "United States",
//                 "id": 14305
//             },
//             "sortOrder": [
//                 {
//                     "property": "orders.id",
//                     "direction": "desc"
//                 }
//             ],
//             "shippingMethod": {
//                 "id": "01FCYX3QCC4WNY6727PWTSCGCS",
//                 "type": "bulk_special",
//                 "supplierCode": "ORDER_FEE",
//                 "label": "Post Picture Day Order Fee"
//             },
//             "totalOrders": 1,
//             "id": "01FH8A1VXMKE8ASRVQ2KGB4MWK"
//         }
//     ]
// }

// console.log(data.batchJobs[0].batchReference)

require("dotenv").config({ path: "../.ENV" });
const axios = require("axios");

/**
 *
 * @param {string} date - date string
 * @returns {string} date - yyyy-mm-dd syntax
 */
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

/**
 *
 * @returns {array} res.data - response object from endpoint
 */
async function pullOrders() {
  //   const today = formatDate(Date.now());
  const today = "2021-09-24";
  console.log(today);

  try {
    let res = await axios.get(
      `http://localhost:5000/api/orders/getOrders/${today}`
    );
    if (res.status == 200) {
      console.log(res.data.length + " Orders pulled for today");
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
      "http://localhost:5000/api/batches/batches/getBatchID"
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
  const param_url = new URL(`http://localhost:5000/api/orders/orders/`);

  const config = {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    for (let i = 0; i < Arr.length; i++) {
      repo = await axios.put(
        `${param_url.href}${Arr[i].idorders}`,
        Arr[i],
        config
      );
    }
  } catch (err) {
    console.error(err);
  }
}

// Step 4
async function makeAPIBatchCall(arr) {
  let idArray = arr.map(({ orderID }) => orderID); // grabs all order ID's from current array

  let fmPayload = {
    batchJob: {
      orders: idArray,
      sortOrder: [
        {
          direction: "desc",
          property: "orders.id",
        },
      ],
      sendTo: "ship_to_address",
      shippingMethod: "01FCYX3QCC4WNY6727PWTSCGCS",
      address: {
        name: "Strawbridge Studios",
        phone: "+1 800 326 9080",
        address1: "13616 Hillsborough Rd",
        zipCode: "27705",
        city: "Durham",
        country: "US",
        state: "US-NC",
      },
    },
  };
//   console.log(fmPayload)
  return fmPayload
}

async function sendBatchInfo(arr){
    let results = []
    for (const batchID in arr) {
        console.log(batchID)
        const fmResult = await makeAPIBatchCall(arr[batchID])
        results = results.concat(fmResult);
        // console.log(results)
    }
    return results
}


/**
 * 
 * @param {array} arr - Array of batches
 * @param {string} property - what you want to group by
 * @returns 
 */
async function groupBy(arr, property) {
  return arr.reduce(function (memo, x) {
    //   console.log(memo)
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

// Step 5
function updateBatchTable() {
  const paperSurface = "Glossy";
  const paperWidth = 10;
  const batchLength = 0; // what is batchLength?
  const envelopeType = "UC";
  const shipMethod = "S2H";

  const batchPayload = {
    batchID: batchID,
    fmBatchId: fmBatchId,
    paperSurface: paperSurface,
    paperWidth: paperWidth,
    batchLength: batchLength,
    envelopeType: envelopeType,
    shipMethod: shipMethod,
    recQC: 1,
    preRipQC: 1,
    postRipQC: 1,
  };
}

async function buildBatchLogic() {
  let orders = await pullOrders(); // step 1
  let batches = await setBatches(orders, 800); // step 2 & 3
  let cleanedData = await cleanOrderObj(batches);
  // updateOrdersTable(cleanedData)
  let batchingGroup = await groupBy(batches, "batchID");
  console.log(batchingGroup)
//   sendBatchInfo(batchingGroup[101006]);
  let batchInfo = await sendBatchInfo(batchingGroup)
    console.log(batchInfo)
}

buildBatchLogic();

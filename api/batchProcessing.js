require("dotenv").config({ path: "../.ENV" });
const axios = require("axios");
// const connection = require("../config/mysql_connection");
const orders = require("../orders");

/*
TO DO
1. SQL Statement with yesterdays date and where batchCategory like "Auto"
2. Loop through orders, taking the paperLength and adding that up until it will exceed 6900
    1. Assign batch number to that "batch"
    2. If there are any remaining orders, make a new batch until there are no more orders left. **
3. ORDERS TABLE
    1. assign `batchID` to each order in that batch
        1. How do we assign the batch ID?
            1. Query the table and get the last batch ID, increment by one
    2. assign `batchSequence` to each order in that batch
4. Fotomerchant API Call. 
    1. Once the orders table has been updated, take that array of orders and make the batch call
    2. Try to replicate the request object in the api notes
    3. Get response object back
5. BATCHES TABLE
    1. `batchID` will be assigned to `batchNumber`
    2. `fmBatchID` will be assigned from the response object
    3. `paperSurface` needs to be set to "Glossy"
    4. `paperWidth` needs to be set to 10
    5. `batchLength` needs to be set (decimal)
    6. `envelopeType` needs to be set to "UC"
    7. `shipMethod` needs to be set to "S2H"
    8. Set workflow tags through config file
        1. come up with a .json that we can reference for this, maybe get with Jay
6. ** Keep going until there are no more batches
*/

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
  // const today = formatDate(Date.now())
  // console.log(today)
  const today = "2021-09-24";

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
 * @param {array} orders - the results being returned from the DB
 * @param {number} threshold - the maximum sum of paperLength for a batch
 * @returns {array} batchData - array of arrays containing order Ids
 */
async function setBatches(orders, threshold) {
  let i;
  let totalBatchLength = 0;
  let batchArr = [];
  let batchID = await getBatchID();

  // loop through array and add paperLength until it exceeds threshold
  for (i = 0; i < orders.length && totalBatchLength < threshold; i++) {
    totalBatchLength += orders[i].paperLength;
    // push order id into array for API call
    batchArr.push(orders[i].orderID);
  }
  // return an object containing an array of orderID's for a batch,
  // the index it reached looping through the orders array,
  // and the sum of all the paperLength in that batch
  return { batchArr, index: i, totalBatchLength };
}

/**
 *
 * @returns {string} batchNum - last Batch Id returned from DB
 */
async function getBatchID() {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/batches/batches/getBatchID"
    );
    let batchNum = response.data[0].batchNumber;
    return batchNum;
  } catch (error) {
    console.error(error);
  }
}

// updateOrdersTable
function updateOrdersTable() {
  //code
}

// Step 4
function sendBatchInfo() {
  // Send response to FM api call
  // parse through response, grab certain info
}

// Step 5
function updateFulfillmentTable() {
  //code
}

async function buildBatchLogic() {
  let orders = await pullOrders(); // step 1
  let batches = await setBatches(orders, 2000); // step 2 & 3
  console.log(batches)
}

buildBatchLogic()
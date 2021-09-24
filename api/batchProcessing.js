require("dotenv").config({ path: "../.ENV" });
const axios = require("axios");
const connection = require("../config/mysql_connection");
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
            1. Query the table and 
    2. assign `batchSequence` to each order in that batch
4. Fotomerchant API Call. 
    1. Once the orders table has been updated, take that array of orders and make the batch call
    2. Try to replicate the request object in the api notes
    3. Get response object back
5. FULFILLMENT TABLE
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

function getBatchID(connection) {
    let sql = "SELECT batchNumber FROM fulfillment ORDER BY batchNumber DESC LIMIT 1";
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;
      const batchNum = Object.values(results[0])[0]
      console.log(batchNum)
    return results;
    });
  }

  getBatchID(connection)


// async function findMaxBatch() {
//     const batch = await getBatchID(connection)
//     console.log("batch is : ", batch)
// }

// findMaxBatch()

// function setBatches(orders, threshold) {
//     let i
//     let totalBatchLength = 0
//     let batchArr = []

//     // loop through array and add paperLength until it exceeds threshold
//     for(i = 0; i < orders.length && totalBatchLength < threshold; i++) {
//         totalBatchLength += orders[i].paperLength
//         // push order id into array for API call
//         batchArr.push(orders[i].orderID)
//     }
//     // return an object containing an array of orderID's for a batch, 
//     // the index it reached looping through the orders array,
//     // and the sum of all the paperLength in that batch
//     return { batchArr, index: i, totalBatchLength }
// }


// batches = setBatches(orders, 1000)
// console.log(batches)
const axios = require("axios");

const results = {
  101008: [
    {
      idorders: 192,
      orderID: "01FHBBZCMPKFRKRJX86EX6TCCB",
      batchID: 101008,
      batchSequence: 1,
      totalBatchLength: 32,
      batchCategory: "Automation",
    },
    {
      idorders: 193,
      orderID: "01FHBC23GN4P8VB42H5SFJ9NHF",
      batchID: 101008,
      batchSequence: 2,
      totalBatchLength: 64,
      batchCategory: "Automation",
    },
  ],
  101009: [
    {
      idorders: 212,
      orderID: "01FHBCDAGHPQ2V2PM4R1ZXK5GR",
      batchID: 101009,
      batchSequence: 1,
      totalBatchLength: 56,
      batchCategory: "Automation",
    },
    {
      idorders: 213,
      orderID: "01FHBCYFGMW9V5XP0AC2700QJV",
      batchID: 101009,
      batchSequence: 2,
      totalBatchLength: 143,
      batchCategory: "Automation",
    },
  ],
  101010: [
    {
      idorders: 224,
      orderID: "01FHBD19HXR41J86NX9A806WJ4",
      batchID: 101010,
      batchSequence: 1,
      totalBatchLength: 48,
      batchCategory: "Automation",
    },
    {
      idorders: 225,
      orderID: "01FHBD39DFFP8GPKR30HEQM23K",
      batchID: 101010,
      batchSequence: 2,
      totalBatchLength: 88,
      batchCategory: "Automation",
    },
    {
      idorders: 226,
      orderID: "01FHBD6GGZFAMZHERFEWJ8VP0Z",
      batchID: 101010,
      batchSequence: 3,
      totalBatchLength: 130,
      batchCategory: "Automation",
    },
  ],
};

const fmBatchInfo = [
  {
    batchJobs: [
      {
        type: "order_distribution_df",
        batchReference: "B21-106-8LSIP1",
        state: "STATE_QUEUED_FOR_PROCESSING",
        shippingAddress: {
          name: "Strawbridge Studios",
          firstName: "Strawbridge",
          lastName: "Studios",
          phone: "18003269080",
          address1: "13616 Hillsborough Rd",
          city: "Durham",
          zipCode: "27705",
          state: "US-NC",
          stateLabel: "NC",
          country: "US",
          countryLabel: "United States",
          id: 14338,
        },
        sortOrder: [{ property: "orders.id", direction: "desc" }],
        shippingMethod: {
          id: "01FCYX3QCC4WNY6727PWTSCGCS",
          type: "bulk_special",
          supplierCode: "ORDER_FEE",
          label: "Post Picture Day Order Fee",
        },
        totalOrders: 2,
        id: "01FHBH14M9BNMQF8963C3YM219",
      },
    ],
  },
  {
    batchJobs: [
      {
        type: "order_distribution_df",
        batchReference: "B21-106-I8559V",
        state: "STATE_QUEUED_FOR_PROCESSING",
        shippingAddress: {
          name: "Strawbridge Studios",
          firstName: "Strawbridge",
          lastName: "Studios",
          phone: "18003269080",
          address1: "13616 Hillsborough Rd",
          city: "Durham",
          zipCode: "27705",
          state: "US-NC",
          stateLabel: "NC",
          country: "US",
          countryLabel: "United States",
          id: 14339,
        },
        sortOrder: [{ property: "orders.id", direction: "desc" }],
        shippingMethod: {
          id: "01FCYX3QCC4WNY6727PWTSCGCS",
          type: "bulk_special",
          supplierCode: "ORDER_FEE",
          label: "Post Picture Day Order Fee",
        },
        totalOrders: 2,
        id: "01FHBH15E0FKYZ35GWR0HHDHSD",
      },
    ],
  },
  {
    batchJobs: [
      {
        type: "order_distribution_df",
        batchReference: "B21-106-19T1DI",
        state: "STATE_QUEUED_FOR_PROCESSING",
        shippingAddress: {
          name: "Strawbridge Studios",
          firstName: "Strawbridge",
          lastName: "Studios",
          phone: "18003269080",
          address1: "13616 Hillsborough Rd",
          city: "Durham",
          zipCode: "27705",
          state: "US-NC",
          stateLabel: "NC",
          country: "US",
          countryLabel: "United States",
          id: 14340,
        },
        sortOrder: [{ property: "orders.id", direction: "desc" }],
        shippingMethod: {
          id: "01FCYX3QCC4WNY6727PWTSCGCS",
          type: "bulk_special",
          supplierCode: "ORDER_FEE",
          label: "Post Picture Day Order Fee",
        },
        totalOrders: 3,
        id: "01FHBH165RTZDPGK9RYSZ48MQY",
      },
    ],
  },
];

async function sendBatchInfo(arr) {
  let results = [];
  for (const batchID in arr) {
    console.log(batchID);
    const fmResult = await makeAPIBatchCall(arr[batchID]);
    results = results.concat(fmResult);
    // console.log(results)
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

  let param_url = new URL(`https://api.staging.fotomerchanthv.com/batch_jobs`);

  const config = {
    method: "post",
    url: param_url.href,
    data: fmPayload,
    headers: {
      Authorization:
        "Bearer MmQwNTlkZjJhMjM4NGI1NjZlOTc4MjVjYTRhMjZkYjIyY2RkMzVjNzRkZmVhMWIxY2E3NjU3NTNkOTlkYWI1Ng",
    },
  };

  try {
    let res = await axios(config);
    if (res.status == 200) {
      console.log("Batch Call successful...");
    }
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

// let whatevs = await sendBatchInfo(results);
// console.log(JSON.stringify(whatevs))

function objectLength(obj) {
    let result = 0;
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        result++;
      }
    }
    return result;
  }



async function updateBatchTable(results, fmBatchInfo) {
    const batchInfo = []
    // console.log(results[101008][0])
    console.log(typeof results);
    // console.log(results)
    let fmObjcount = objectLength(fmBatchInfo)
    let orderObjCount = objectLength(results)
    console.log(fmObjcount)
    console.log(orderObjCount)

    // console.log(results[101008][0].totalBatchLength)

    for (let i = 0; i < fmObjcount; i++) {
        let fmBatchId = fmBatchInfo[i].batchJobs[0].batchReference
        batchInfo.push(fmBatchId)
    }

 let blah = results[Object.keys(results)[[Object.keys(results).length - 1]]];
 console.log(blah)

 let fruitObject = { 'a' : 'apple', 'b' : 'banana', 'c' : 'carrot' };
 let meh = Object.keys(fruitObject); // this returns all properties in an array ["a", "b", "c"]
//  console.log(meh)
 
 let wtf = fruitObject[Object.keys(fruitObject)[Object.keys(fruitObject).length - 1]]
//  console.log(wtf)


  const paperSurface = "Glossy";
  const paperWidth = 10;
  const batchLength = 0; // what is batchLength?
  const envelopeType = "UC";
  const shipMethod = "S2H";
//   const batchID = "101007";
  const fmBatchId = "B21-105-8ME9XS";
  const retouch = 1;
  const retouchQC = 1;

  const batchPayload = {
    // batchNumber: batchID,
    fmBatchId: fmBatchId,
    paperSurface: paperSurface,
    paperWidth: paperWidth,
    batchLength: batchLength,
    envelopeType: envelopeType,
    shipMethod: shipMethod,
    recQC: 1,
    preRipQC: 1,
    postRipQC: 1,
    retouch: retouch,
    retouchQC: retouchQC,
  };

//   console.log(batchPayload);

  const param_url = new URL(`http://localhost:5000/api/batches/batches/`);

  const config = {
    method: "post",
    url: param_url.href,
    data: batchPayload,
    headers: {
      "Content-Type": "application/json",
    },
  };

//   console.log(config)
  // try {
  //   for (let i = 0; i < Arr.length; i++) {
  //   repo = await axios(config);
  //   }
  // } catch (err) {
  //   console.error(err);
  // }
}

updateBatchTable(results, fmBatchInfo)



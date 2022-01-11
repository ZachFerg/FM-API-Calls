require('dotenv').config();
const getOrderLab = require('./GetOrderLab');
const getListOrders = require('./GetListOrders');
const batchProcessing = require('./batchProcessing');

async function getTodaysOrders() {
  let data = await getListOrders.generatePageArray();
  let result = await getOrderLab.getOrderLabData(data.flat(Infinity));
  await batchProcessing.doAllBatches();
}

getTodaysOrders();

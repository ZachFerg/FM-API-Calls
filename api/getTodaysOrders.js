require('dotenv').config();
const getOrderLab = require('./GetOrderLab');
const getListOrders = require('./GetListOrders');

async function getTodaysOrders() {
  let data = await getListOrders.generatePageArray();
  let result = await getOrderLab.getOrderLabData(data);
  // return result;
}

getTodaysOrders();


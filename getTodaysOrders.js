require('dotenv').config();
const getOrderLab = require('./api/GetOrderLab');
const getListOrders = require('./api/GetListOrders');

async function getTodaysOrders() {
  data = await getListOrders.sendOrderList();
  let result = await getOrderLab.sendResults(data);
  return result;
}

getTodaysOrders();

require('dotenv').config();
const getOrderLab = require('./api/GetOrderLab');
const getListOrders = require('./api/GetListOrders');

function doLorocoCall() {
  const url = `fmp://FM.Server:IdesOfMarch@192.168.1.180/LOROCO.fmp12?script=(FMP)%20Fotomerchant%20Lorocos `;
  return axios.get(url).then((res) => console.log(res.data));
}

async function getTodaysOrders() {
  data = await getListOrders.sendOrderList();
  let result = await getOrderLab.sendResults(data);
  return result;
}

// getTodaysOrders();

doLorocoCall();

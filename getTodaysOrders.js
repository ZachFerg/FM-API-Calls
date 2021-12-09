require('dotenv').config();
const getOrderLab = require('./api/GetOrderLab');
const getListOrders = require('./api/GetListOrders');
const axios = require('axios');

function doLorocoCall() {
  const url = `fmp://FM.Server:IdesOfMarch@192.168.1.180/LOROCO.fmp12?script=(FMP)%20Fotomerchant%20Lorocos `;
  return axios(url).catch(function (error) {
    if (error.response) {
      // Request made and server responded
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });
}

// async function getTodaysOrders() {
//   data = await getListOrders.sendOrderList();
//   let result = await getOrderLab.sendResults(data);
//   return result;
// }

// getTodaysOrders();

doLorocoCall();

require('dotenv').config()
var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://api.fotomerchanthv.com/orders/01EV8E4XAFVE6116BHTE3QEG9A/lab',
  headers: { 
    'Authorization': process.env.FM_API_KEY
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data.order.id));
})
.catch(function (error) {
  console.log(error);
});
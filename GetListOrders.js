require('dotenv').config()
var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://api.fotomerchanthv.com/orders?page=1&limit=100&type=all&orderDir=ASC&from=2021-07-25&to=2021-07-26',
  headers: { 
    'Authorization': process.env.FM_API_KEY,
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

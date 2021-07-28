require("dotenv").config();
var axios = require("axios");

var config = {
  method: "get",
  url: "https://api.fotomerchanthv.com/orders?page=1&limit=100&type=all&orderDir=ASC&from=2021-07-25&to=2021-07-26",
  headers: {
    Authorization: process.env.FM_API_KEY,
  },
};

async function getListOrders() {
  console.log("Starting Get List Orders call.....");
  try {
    let res = await axios(config);
    if (res.status == 200) {
      // test for status you want, etc
      console.log(res.status);
    }
    // Don't forget to return something
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
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
      console.log(res.status);
      console.log("Order Call successful...");
    }
    // Don't forget to return something
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

getListOrders().then((data) => {
  console.log("Need to grab all the order ID's");
  const orderIDList = [];
  try {
    data.orders.forEach(function (order) {
      orderIDList.push(order.id);
    });
    // console.log(orderIDList);
    return orderIDList;
  } catch (err) {
    console.error(err);
  }
});

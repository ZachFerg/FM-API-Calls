require("dotenv").config();
const axios = require("axios");

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const today = new Date();
const yesterday = new Date(today);
const day_before = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);
day_before.setDate(day_before.getDate() - 2);

const fm_yesterday = formatDate(yesterday);
const fm_day_before = formatDate(day_before);

// takes url and appends parameters
const param_url = new URL(
  "https://api.fotomerchanthv.com/orders?page=1&limit=100&type=all&orderDir=ASC&from=&to="
);
const params = { from: fm_day_before, to: fm_yesterday };
Object.keys(params).forEach((key) =>
  param_url.searchParams.append(key, params[key])
);

console.log(param_url.href)

const config = {
  method: "get",
  url: param_url.href,
  headers: {
    Authorization: process.env.FM_API_KEY,
  },
};

async function getListOrders() {
  console.log("Starting Get List Orders call.....");
  try {
    let res = await axios(config);
    if (res.status == 200) {
      // console.log(res.status);
      console.log("Order Call successful...");
    } else if (res.status == 504) {
      console.log("Order Call timed out, retrying...")
      getListOrders()
    }
    // Don't forget to return something
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

getListOrders().then((data) => {
  console.log(
    "There are a total of " +
      data.paging.total +
      " orders for today, grabbing order ID's"
  );
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

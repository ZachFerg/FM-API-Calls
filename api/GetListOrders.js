require("dotenv").config({ path: "../.ENV" });
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
  `https://api.fotomerchanthv.com/orders?limit=100&type=all&orderDir=ASC&`
);
const params = { from: fm_day_before, to: fm_yesterday };
Object.keys(params).forEach((key) =>
  param_url.searchParams.append(key, params[key])
);

const config = {
  method: "get",
  headers: {
    Authorization: process.env.FM_API_KEY,
  },
};

console.log(param_url.href);

async function getAllOrderIds() {
  console.log("Starting Get List Orders call.....");

  let repo = null;
  page_count = 1;
  results = [];

  try {
    do {
      repo = await axios.get(`${param_url.href}&page=${page_count++}`, config);
      console.log(repo.data.paging);
      results = results.concat(repo.data.orders);
    } while (repo.data.paging.page < repo.data.paging.last);
  // } while (repo.data.paging.page < 5);

    return results;
  } catch (error) {
    console.log(error);
  }
}

async function gatherAllIDs(data) {
  const orderIDList = [];
  try {
    data.forEach(function (order) {
      orderIDList.push(order.id);
    });
    return orderIDList;
  } catch (err) {
    console.error(err);
  }
  console.log(orderIDList);
}

async function sendOrderList() {
  data = await getAllOrderIds();
  let orderIDList = await gatherAllIDs(data);
  return orderIDList;
}

module.exports = { getAllOrderIds, gatherAllIDs, sendOrderList };

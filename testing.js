const axios = require('axios');

axios.defaults.headers.common['Authorization'] =
  'Bearer ZmU1YjA4ZmZiODIzMzk3YmQxZmIwZTU0MWY4ZDA2ODcxZDUwYjJmYjg0MmZiNWRkN2VjYmQwZmUyNWM5MmQ3Mw';

const today = new Date();
const yesterday = new Date(today);
const day_before = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);
day_before.setDate(day_before.getDate() - 2);

const fm_yesterday = formatDate(yesterday);
const fm_day_before = formatDate(day_before);

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

const generatePageCount = async (n) =>
  [...new Array(n)].map((item, i) => i + 1);

function fetchPageCount() {
  // const url = `https://api.fotomerchanthv.com/orders/${order_id}/lab`;
  const param_url = new URL(
    `https://api.fotomerchanthv.com/orders?limit=100&type=all&orderDir=ASC&page=1`,
  );

  const params = { from: fm_day_before, to: fm_yesterday };
  Object.keys(params).forEach((key) =>
    param_url.searchParams.append(key, params[key]),
  );
  return axios
    .get(param_url.href)
    .then((res) => console.log(res.data.paging.last));
}

// let pageCount = fetchPageCount();
// console.log(pageCount);

require("dotenv").config({ path: "../.ENV" });
const axios = require("axios");
const request = require("request");
const getListOrders = require("./GetListOrders");

// const orderIDList = getListOrders.orderIDList;

const orders = [];
const undefinedOrders = [];

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

async function getOrderLab(order_id) {
  console.log("Starting Get Order Lab call.....");
  let param_url = new URL(
    `https://api.fotomerchanthv.com/orders/${order_id}/lab`
  );

  const config = {
    method: "get",
    url: param_url.href,
    headers: {
      Authorization: process.env.FM_API_KEY,
    },
  };

  try {
    let res = await axios(config);
    if (res.status == 200) {
      console.log("Order Call successful...");
    }
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

async function processOrders(data, payload) {
  let result;

  try {
    const finalPayload = {
      orderID: data.order.id,
      _fknShootNumber: data.order.clientSession.externalReference,
      _fktCustomerNo: data.order.clientSession.client.externalReference,
      _fktPackage: null, // Will revisit this one after first pass
      clientName: data.order.clientSession.client.label,
      customerName: data.order.recipientName,
      dateIn: formatDate(data.order.createdAt),
      emailAddress: data.order.recipientEmail,
      fmhvCategory: data.order.clientSession.clientSessionCategory.label,
      fmhvPackageCost: data.order.subTotal,
      fmhvPaymentMethod: data.order.paymentMethod,
      fmhvSeason: data.order.clientSession.season.label,
      fmhvSession: data.order.clientSession.label,
      fmhvShipCode: null, // Will revisit this one after first pass
      fmhvShipCost: data.order.shippingTotal,
      fmhvStage: data.order.clientSessionStage.label,
      fmhvTotal: data.order.total,
      grade: data.order.subject.grade,
      graduationYear: null, // Will revisit this one after first pass
      homeAddress: data.order.shippingAddress.address1,
      homeAddress2: null, // Will revisit this one after first pass
      homeCity: data.order.shippingAddress.city,
      homePhone1: data.order.shippingAddress.phone,
      homeState: data.order.shippingAddress.stateLabel,
      homeZip: data.order.shippingAddress.zipCode,
      namesOnPrints: null, // Will revisit this one after first pass
      OnlineCode: data.order.subject.password,
      parentFirstName: data.order.shippingAddress.firstName,
      parentLastName: data.order.shippingAddress.firstName,
      referenceNumber: data.order.orderReference,
      relationshipToStudent: null,
      seasonExternalReference:
        data.order.clientSession.season.externalReference,
      shippingDiscount: data.order.couponDiscountTotal,
      shippingMethod: null, // Will revisit this one after first pass
      studentFirstName: data.order.subject.firstName,
      studentID: data.order.subject.subjectId,
      studentLastName: data.order.subject.lastName,
      teacher: data.order.subject.teacher,
      TM: data.order.clientSession.client.territoryCode,
    };
    orders.push(finalPayload);
    return orders;
  } catch (err) {
    if ((err.name = "TypeError")) {
      console.log("Looks like that order didn't have all the objects needed");
      console.log(
        "order " + data.order.id + " is being added to a list to show later"
      );
      undefinedOrders.push(data.order.id);
      return undefinedOrders;
    } else {
      console.log("it's not a TypeError");
    }
  }
}

async function sendResults(undefinedOrders, orderIDList) {
  for (let i = 0; i < orderIDList.length; i++) {
    let order_id = orderIDList[i];
    data = await getOrderLab(order_id);
    let result = await processOrders(data);
  }
  // console.log(
  //   "Posting to Database, the number of undefined orders was: ",
  //   undefinedOrders.length
  // );
  request.post(
    {
      url: "http://localhost:3000/loroco_test",
      body: orders,
      json: true,
    },
    function (error, response, body) {
      console.log(body);
    }
  );
}

// sendResults(undefinedOrders);


module.exports = { getOrderLab, processOrders, sendResults };

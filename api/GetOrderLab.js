require("dotenv").config({ path: "../.ENV" });
const axios = require("axios");
const request = require("request");
const getListOrders = require("./GetListOrders");

const orders = [];
const badIDs = [];

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
    `https://api.fotomerchanthv.com/orders/${order_id}`
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
  // will eventually find a better way to do this, for now using optional chaining and nullish coalescing to set values
  // to null if the object can't be found.
  const studentFirstName = data.order?.subject?.firstName ?? null;
  const studentLastName = data.order?.subject?.password ?? null;
  const studentID = data.order?.subject?.subjectId ?? null;
  const grade = data.order?.subject?.grade ?? null;
  const onlineCode = data.order?.subject?.password ?? null;
  const teacher = data.order?.subject?.teacher ?? null;
  const homeAddress = data.order?.shippingAddress?.address1 ?? null;
  const homeCity = data.order?.shippingAddress?.city ?? null;
  const homePhone1 = data.order?.shippingAddress?.phone ?? null;
  const homeState = data.order?.shippingAddress?.stateLabel ?? null;
  const homeZip = data.order?.shippingAddress?.zipCode ?? null;
  const parentFirstName = data.order?.shippingAddress?.firstName ?? null;
  const parentLastName = data.order?.shippingAddress?.lastName ?? null;

  // const studentLastName = data.order?.subject?.firstName ?? data.order.orderFormEntrys[0].values["FAIWPO2NJ4-E9K-PL1I0Y"];
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
      grade: grade,
      graduationYear: null, // Will revisit this one after first pass
      homeAddress: homeAddress,
      homeAddress2: null, // Will revisit this one after first pass
      homeCity: homeCity,
      homePhone1: homePhone1,
      homeState: homeState,
      homeZip: homeZip,
      namesOnPrints: null, // Will revisit this one after first pass
      OnlineCode: onlineCode,
      parentFirstName: parentFirstName,
      parentLastName: parentLastName,
      referenceNumber: data.order.orderReference,
      relationshipToStudent: null,
      seasonExternalReference:
        data.order.clientSession.season.externalReference,
      shippingDiscount: data.order.couponDiscountTotal,
      shippingMethod: null, // Will revisit this one after first pass
      studentFirstName: studentFirstName,
      studentID: studentID,
      studentLastName: studentLastName,
      teacher: teacher,
      TM: data.order.clientSession.client.territoryCode,
    };
    orders.push(finalPayload);
    return orders;
  } catch (err) {
    if ((err.name = "TypeError")) {
      console.log(err)
      console.log("Looks like that order didn't have all the objects needed");
      console.log(
        "order " + data.order.id + " is being added to a list to show later"
      );
      badIDs.push(data.order.id);
      return badIDs;
    } else {
      console.log("it's not a TypeError");
    }
  } finally {
    undefinedOrders = [];
    undefinedOrders = badIDs;
    return { orders: orders, undefinedOrders: undefinedOrders };
  }
}

async function sendResults(orderIDList) {
  try {
    for (let i = 0; i < orderIDList.length; i++) {
      let order_id = orderIDList[i];
      data = await getOrderLab(order_id);
      let { result, undefinedOrders } = await processOrders(data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    request.post(
      {
        url: "http://localhost:3000/loroco_test",
        body: orders,
        json: true,
      },
      function (error, response, body) {
        // console.log(body);
      },
      console.log(
        "Posting to Database, the number of undefined orders was: ",
        undefinedOrders.length
      )
    );
  }
}

module.exports = { getOrderLab, processOrders, sendResults };

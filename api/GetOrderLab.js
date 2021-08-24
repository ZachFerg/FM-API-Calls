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
  console.log("Starting Get Order Lab call for: ", order_id);
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

  const orderID = data?.order?.id ?? null;
  const _fknShootNumber = data?.order?.clientSession?.externalReference ?? null;
  const _fktCustomerNo = data?.order?.clientSession?.client?.externalReference ?? null;
  const _fktPackage = null // Will revisit this one after first pass
  const clientName = data?.order?.clientSession?.client?.label ?? null;
  const customerName = data?.order?.recipientName ?? null;
  const dateIn = data?.order?.createdAt ?? null;
  const emailAddress = data?.order?.recipientEmail ?? null;
  const fmhvCategory = data?.order?.clientSession?.clientSessionCategory?.label ?? null;
  const fmhvPackageCost = data?.order?.subTotal ?? null;
  const fmhvPaymentMethod = data?.order?.paymentMethod ?? null;
  const fmhvSeason = data?.order?.clientSession?.season?.label ?? null;
  const fmhvSession = data?.order?.clientSession?.label ?? null;
  const fmhvShipCode =  null// Will revisit this one after first pass
  const fmhvShipCost = data?.order?.shippingTotal ?? null;
  const fmhvStage = data?.order?.clientSessionStage?.label ?? null;
  const fmhvTotal = data?.order?.total ?? null;
  const grade = data?.order?.subject?.grade ?? null;
  const graduationYear = null  // Will revisit this one after first pass
  const homeAddress = data?.order?.shippingAddress?.address1 ?? null;
  const homeAddress2 = null  // Will revisit this one after first pass
  const homeCity = data?.order?.shippingAddress?.city ?? null;
  const homePhone1 = data?.order?.shippingAddress?.phone ?? null;
  const homeState = data?.order?.shippingAddress?.stateLabel ?? null;
  const homeZip = data?.order?.shippingAddress?.zipCode ?? null;
  const namesOnPrints = null // Will revisit this one after first pass
  const onlineCode = data?.order?.subject?.password ?? null;
  const parentFirstName = data?.order?.shippingAddress?.firstName ?? null;
  const parentLastName = data?.order?.shippingAddress?.lastName ?? null;
  const referenceNumber = data?.order?.orderReference ?? null;
  const relationshipToStudent = null // Will revisit this one after first pass
  const seasonExternalReference = data?.order?.clientSession?.season?.externalReference ?? null;
  const shippingDiscount = data?.order?.couponDiscountTotal ?? null;
  const shippingMethod = null  // Will revisit this one after first pass
  const studentFirstName = data?.order?.subject?.firstName ?? null;
  const studentID = data?.order?.subject?.subjectId ?? null;
  const studentLastName = data?.order?.subject?.password ?? null;
  const teacher = data?.order?.subject?.teacher ?? null;
  const TM = data?.order?.clientSession?.client?.territoryCode ?? null;

  let result;

  try {
    const finalPayload = {
      orderID: orderID,
      _fknShootNumber: _fknShootNumber,
      _fktCustomerNo: _fktCustomerNo,
      _fktPackage: _fktPackage,
      clientName: clientName,
      customerName: customerName,
      dateIn: formatDate(dateIn),
      emailAddress: emailAddress,
      fmhvCategory: fmhvCategory,
      fmhvPackageCost: fmhvPackageCost,
      fmhvPaymentMethod: fmhvPaymentMethod,
      fmhvSeason: fmhvSeason,
      fmhvSession: fmhvSession,
      fmhvShipCode: fmhvShipCode,
      fmhvShipCost: fmhvShipCost,
      fmhvStage: fmhvStage,
      fmhvTotal: fmhvTotal,
      grade: grade,
      graduationYear: graduationYear,
      homeAddress: homeAddress,
      homeAddress2: homeAddress2,
      homeCity: homeCity,
      homePhone1: homePhone1,
      homeState:homeState,
      homeZip: homeZip,
      namesOnPrints: namesOnPrints,
      onlineCode: onlineCode,
      parentFirstName: parentFirstName,
      parentLastName: parentLastName,
      referenceNumber: referenceNumber,
      relationshipToStudent: relationshipToStudent,
      seasonExternalReference: seasonExternalReference,
      shippingDiscount: shippingDiscount,
      shippingMethod: shippingMethod,
      studentFirstName: studentFirstName,
      studentID: studentID,
      studentLastName: studentLastName,
      teacher: teacher,
      TM: TM
    };
    orders.push(finalPayload);
    return orders;
  } catch (err) {
      console.log(err)
      badIDs.push(data.order.id);
      return badIDs;
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
        console.log(response);
        console.log(error);
      },
      console.log(
        "Posting to Database, the number of undefined orders was: ",
        undefinedOrders.length
      )
    );
  }
}

module.exports = { getOrderLab, processOrders, sendResults };

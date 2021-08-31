require("dotenv").config({ path: "../.ENV" });
const axios = require("axios");
const request = require("request");
const getListOrders = require("./GetListOrders");
const helperOBJ = require("../helpers/optionObjects");

const orders = [];

function formatRelationship(string) {
  studString = string;
  result = studString.replace(
    studString,
    (m) => helperOBJ.studentRelationship[m]
  );
  return result;
}

function formatGrade(string) {
  gradeString = string;
  result = gradeString.replace(gradeString, (m) => helperOBJ.gradeMap[m]);
  return result;
}

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
  let param_url = new URL(`https://api.fotomerchanthv.com/orders/${order_id}`);

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

async function processOrders(data) {
  // will eventually find a better way of doing this, but for now...
  const orderID = data?.order?.id ?? null;
  const _fknShootNumber = data?.order?.clientSession?.externalReference ?? null;
  const _fktCustomerNo =
    data?.order?.clientSession?.client?.externalReference ?? null;
  const _fktPackage = null; // Will revisit this one after first pass
  const clientName = data?.order?.clientSession?.client?.label ?? null;
  const customerName = data?.order?.recipientName ?? null;
  const dateIn = data?.order?.createdAt ?? null;
  const emailAddress = data?.order?.recipientEmail ?? null;
  const fmhvCategory =
    data?.order?.clientSession?.clientSessionCategory?.label ?? null;
  const fmhvPackageCost = data?.order?.subTotal ?? null;
  const fmhvPaymentMethod = data?.order?.paymentMethod ?? null;
  const fmhvSeason = data?.order?.clientSession?.season?.label ?? null;
  const fmhvSession = data?.order?.clientSession?.label ?? null;
  const fmhvShipCode = data?.order?.shippingMethod?.code ?? null; // Will revisit this one after first pass
  const fmhvShipCost = data?.order?.shippingTotal ?? null;
  const fmhvStage = data?.order?.clientSessionStage?.label ?? null;
  const fmhvTotal = data?.order?.total ?? null;
  const grade =
    data?.order?.subject?.grade ??
    data?.order?.orderFormEntrys[0]?.values["F98OL37WDL-9AM-LVRZG4"] ??
    "U";
  const graduationYear = null; // Will revisit this one after first pass
  const homeAddress = data?.order?.shippingAddress?.address1 ?? null;
  const homeAddress2 = data?.order?.shippingAddress?.address2 ?? null;
  const homeCity = data?.order?.shippingAddress?.city ?? null;
  const homePhone1 = data?.order?.shippingAddress?.phone ?? null;
  const homeState = data?.order?.shippingAddress?.stateLabel ?? null;
  const homeZip = data?.order?.shippingAddress?.zipCode ?? null;
  const namesOnPrints = null; // Will revisit this one after first pass, need form values
  const onlineCode = data?.order?.subject?.password ?? null;
  const parentFirstName = data?.order?.shippingAddress?.firstName ?? null;
  const parentLastName = data?.order?.shippingAddress?.lastName ?? null;
  const referenceNumber = data?.order?.orderReference ?? null;
  const relationshipToStudent =
    data?.order?.orderFormEntrys[0]?.values["F99T5BZIXA-QGT-NB2EOO"] ?? "U";
  const seasonExternalReference =
    data?.order?.clientSession?.season?.externalReference ?? null;
  const shippingDiscount = data?.order?.couponDiscountTotal ?? null;
  const shippingMethod = data?.order?.shippingMethod?.label ?? null;
  const studentFirstName =
    data?.order?.subject?.firstName ??
    data?.order?.orderFormEntrys[0]?.values["F98OL37Q49-6MA-3EBIV8"] ??
    null;
  const studentID = data?.order?.subject?.subjectId ?? null;
  const studentLastName =
    data?.order?.subject?.lastName ??
    data?.order?.orderFormEntrys[0]?.values["F99TE8YU8F-R88-CSNKAM"] ??
    null;
  const teacher =
    data?.order?.subject?.teacher ??
    data?.order?.orderFormEntrys[0]?.values["F98OL37QJ1-Y5M-DPEU7K"] ??
    null;
  const TM = data?.order?.clientSession?.client?.territoryCode ?? null;
  const dateCreated = data?.order?.createdAt ?? null;
  const dateModified = data?.order?.modifiedAt ?? null;

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
      grade: formatGrade(grade),
      graduationYear: graduationYear,
      homeAddress: homeAddress,
      homeAddress2: homeAddress2,
      homeCity: homeCity,
      homePhone1: homePhone1,
      homeState: homeState,
      homeZip: homeZip,
      namesOnPrints: namesOnPrints,
      onlineCode: onlineCode,
      parentFirstName: parentFirstName,
      parentLastName: parentLastName,
      referenceNumber: referenceNumber,
      relationshipToStudent: formatRelationship(relationshipToStudent),
      seasonExternalReference: seasonExternalReference,
      shippingDiscount: shippingDiscount,
      shippingMethod: shippingMethod,
      studentFirstName: studentFirstName,
      studentID: studentID,
      studentLastName: studentLastName,
      teacher: teacher,
      TM: TM,
      dateCreated: formatDate(dateCreated),
      dateModified: formatDate(dateModified)
    };
    orders.push(finalPayload);
  } catch (err) {
    console.log(err);
  } finally {
    return orders;
  }
}

async function sendResults(orderIDList) {
  try {
    for (let i = 0; i < orderIDList.length; i++) {
      let order_id = orderIDList[i];
      data = await getOrderLab(order_id);
      let orders = await processOrders(data);
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
      console.log("Posting to Database")
    );
  }
}

module.exports = { getOrderLab, processOrders, sendResults };

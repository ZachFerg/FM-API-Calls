require("dotenv").config();
const axios = require("axios");
const { type } = require("os");

sample_data = ["01FBG2PXN313G74YSN1KRPMPVY", "01FBG326J0BX8JJSAS3BSBBWJG"];

order_id = "01FBG326J0BX8JJSAS3BSBBWJG";

const param_url = new URL(
  `https://api.fotomerchanthv.com/orders/${order_id}/lab`
);

console.log(param_url.href);

const config = {
  method: "get",
  url: param_url.href,
  headers: {
    Authorization: process.env.FM_API_KEY,
  },
};

async function getOrderLab() {
  console.log("Starting Get Order Lab call.....");
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

getOrderLab().then((data) => {
  //   console.log(data);
  console.log("making object for MySQL statement");
  try {
    const finalPayload = {
      _fknShootNumber: data.order.clientSession.externalReference,
      _fktCustomerNo: data.order.clientSession.client.externalReference,
      _fktPackage: null,
      Catalog_UID: null,
      Client_Name: data.order.clientSession.client.label,
      Customer_Name: data.order.recipientName,
      dateIn: data.order.createdAt,
      emailAddress: data.order.recipientEmail,
      fmhvCatalog: null,
      fmhvCategory: data.order.clientSession.clientSessionCategory.label,
      fmhvPackageCost: data.order.subTotal,
      fmhvPaymentMethod: data.order.paymentMethod,
      fmhvSeason: data.order.clientSession.season.label,
      fmhvSession: data.order.clientSession.label,
      fmhvShipCode: null,
      fmhvShipCost: data.order.shippingTotal,
      fmhvStage: data.order.clientSessionStage.label,
      fmhvTotal: data.order.total,
      grade: data.order.subject.grade,
      graduationYear: null,
      homeAddress: data.order.shippingAddress.address1,
      homeAddress2: null,
      homeCity: data.order.shippingAddress.city,
      homePhone1: data.order.shippingAddress.phone,
      homeState: data.order.shippingAddress.stateLabel,
      homeZip: data.order.shippingAddress.zipCode,
      LoRoCo: null,
      namesOnPrints: null,
      OnlineCode: data.order.subject.password,
      paidHow: null,
      parentFirstName: data.order.shippingAddress.firstName,
      parentLastName: data.order.shippingAddress.firstName,
      referenceNumber: data.order.orderReference,
      relationshipToStudent: null,
      Season_External_Reference:
        data.order.clientSession.season.externalReference,
      Shipping_Discount: data.order.couponDiscountTotal,
      Shipping_Method: null,
      studentFirstName: data.order.subject.firstName,
      studentID: data.order.subject.subjectId,
      studentLastName: data.order.subject.lastName,
      teacher: data.order.subject.teacher,
      TM: data.order.clientSession.client.territoryCode,
    };

    console.log(finalPayload);
    return finalPayload;
  } catch (err) {
    console.log(err);
    if ((err.name = "TypeError")) {
      const undefinedOrders = [];
      console.log(data.order.id + " is the order that doesn't have all data");
      undefinedOrders.push(data.order.id);
      console.log(undefinedOrders);
    } else {
      console.log("it's not a TypeError");
    }
  }
});

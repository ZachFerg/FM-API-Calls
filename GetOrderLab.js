require("dotenv").config();
var axios = require("axios");

var config = {
  method: "get",
  url: "https://api.fotomerchanthv.com/orders/01EV8E4XAFVE6116BHTE3QEG9A/lab",
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
  console.log("Axios already returns a JSON object so no need to parse");
  console.log(data);
  try {
    console.log("making object for MySQL insertion");
    const finalPayload = {
      _fknShootNumber: data.order.clientSession.externalReference,
      _fktCustomerNo: data.order.clientSession.client.externalReference,
      _fktPackage: "",
      Catalog_UID: "",
      Client_Name: data.order.clientSession.client.label,
      Customer_Name: data.order.recipientName,
      dateIn: data.order.createdAt,
      emailAddress: data.order.recipientEmail,
      fmhvCatalog: "",
      fmhvCategory: data.order.clientSession.clientSessionCategory.label,
      fmhvPackageCost: data.order.subTotal,
      fmhvPaymentMethod: data.order.paymentMethod,
      fmhvSeason: data.order.clientSession.season.label,
      fmhvSession: data.order.clientSession.label,
      fmhvShipCode: "",
      fmhvShipCost: data.order.shippingTotal,
      fmhvStage: data.order.clientSessionStage.label,
      fmhvTotal: data.order.total,
      grade: data.order.subject.grade,
      graduationYear: "",
      homeAddress: data.order.shippingAddress.address1,
      homeAddress2: "",
      homeCity: data.order.shippingAddress.city,
      homePhone1: data.order.shippingAddress.phone,
      homeState: data.order.shippingAddress.stateLabel,
      homeZip: data.order.shippingAddress.zipCode,
      LoRoCo: "",
      namesOnPrints: "",
      OnlineCode: data.order.subject.password,
      paidHow: "",
      parentFirstName: data.order.shippingAddress.firstName,
      parentLastName: data.order.shippingAddress.firstName,
      referenceNumber: data.order.orderReference,
      relationshipToStudent: "",
      Season_External_Reference:
        data.order.clientSession.season.externalReference,
      Shipping_Discount: data.order.couponDiscountTotal,
      Shipping_Method: "",
      studentFirstName: data.order.subject.firstName,
      studentID: data.order.subject.subjectId,
      studentLastName: data.order.subject.lastName,
      teacher: data.order.subject.teacher,
      TM: data.order.clientSession.client.territoryCode,
    };
    console.log(finalPayload);
    return finalPayload;
  } catch (err) {
    console.error(err);
  }
});

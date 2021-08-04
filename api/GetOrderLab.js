require('dotenv').config({path: '../.ENV'})
const axios = require("axios");

sample_data = ["01FBG2PXN313G74YSN1KRPMPVY", "01FBG326J0BX8JJSAS3BSBBWJG", '01FA34TTMSQD34X6YX27BSAJ7G','01FA34TTMSQD34X6YX27BSAJ7G',];

// '01FA34TTMSQD34X6YX27BSAJ7G',
// '01FC1JGMFGK17XH69TBA1XFH8N',
// '01FC1MTS1255Z2R2EY9K4GTPWJ',
// '01FC10CP870MBCAF3NM5Z97012',
// '01FC1PQH13RJ7CE6XNA08Z51H3',
// '01FC1Q0QSHG885ZR81DB8JK1X0',
// '01FC1QGETQE61S31X1448W8ESR',
// '01FC0X38Z8JTXYG6B43C4TJRWF',
// '01FC1R98023S26V7QKYPFPAP7E',
// '01FC1Q9H544QQAN2CP94VGRSNN',
// '01FC1S3BCNY3KMHM3T28AF76G2',

order_id = "01FBPND28BV2JP01N2CZ596KTS";

const param_url = new URL(
  `https://api.fotomerchanthv.com/orders/${order_id}/lab`
);

const config = {
  method: "get",
  url: param_url.href,
  headers: {
    Authorization: process.env.FM_API_KEY,
  },
};

console.log(config.url)

async function getOrderLab() {
  console.log("Starting Get Order Lab call.....");
  try {
    let res = await axios(config);
    if (res.status == 200) {
      // test for status you want, etc
      console.log("Order Call successful...");
    }
    // Don't forget to return something
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

getOrderLab().then((data) => {
  console.log("making object for MySQL statement");
  try {
    const finalPayload = {
      _fknShootNumber: data.order.clientSession.externalReference,
      _fktCustomerNo: data.order.clientSession.client.externalReference,
      _fktPackage: null,  // Will revisit this one after first pass
      Client_Name: data.order.clientSession.client.label,
      Customer_Name: data.order.recipientName,
      dateIn: data.order.createdAt,
      emailAddress: data.order.recipientEmail,
      fmhvCatalog: null,  // Will revisit this one after first pass
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
      namesOnPrints: null,  // Will revisit this one after first pass
      OnlineCode: data.order.subject.password,
      parentFirstName: data.order.shippingAddress.firstName,
      parentLastName: data.order.shippingAddress.firstName,
      referenceNumber: data.order.orderReference,
      relationshipToStudent: null,
      Season_External_Reference:
        data.order.clientSession.season.externalReference,
      Shipping_Discount: data.order.couponDiscountTotal,
      Shipping_Method: null, // Will revisit this one after first pass
      studentFirstName: data.order.subject.firstName,
      studentID: data.order.subject.subjectId,
      studentLastName: data.order.subject.lastName,
      teacher: data.order.subject.teacher,
      TM: data.order.clientSession.client.territoryCode,
    };

    console.log(finalPayload);
    return finalPayload;
  } catch (err) {
    if ((err.name = "TypeError")) {
      const undefinedOrders = [];
      console.log("Looks like that order didn't have all the objects needed");
      console.log(
        "order " + data.order.id + " is being added to a list to show later"
      );
      undefinedOrders.push(data.order.id);
      //   console.log(undefinedOrders);
      return undefinedOrders;
    } else {
      console.log("it's not a TypeError");
    }
  }
});

const request = require("request");

// const json = {
//   name: "Dinesh Chugtai",
//   email: "dinesh@piedpiper.com",
// };

const json = {
  _fknShootNumber: "341122",
  _fktCustomerNo: "113818",
  _fktPackage: null,
  Catalog_UID: null,
  Client_Name: "G C Burkhead Elementary School",
  Customer_Name: "Jennifer Hale",
  dateIn: "2021-07-26T00:16:22+00:00",
  emailAddress: "jlhale87@gmail.com",
  fmhvCatalog: null,
  fmhvCategory: "Spring",
  fmhvPackageCost: "30",
  fmhvPaymentMethod: "stripe",
  fmhvSeason: "Spring Proof 2020-2021",
  fmhvSession: "Spring Pictures 3-22-2021",
  fmhvShipCode: null,
  fmhvShipCost: "7",
  fmhvStage: "5. Late Order: 8x10 Campaign",
  fmhvTotal: "37",
  grade: "1",
  graduationYear: null,
  homeAddress: "93 Pony Chase Lane",
  homeAddress2: null,
  homeCity: "Elizabethtown",
  homePhone1: "5025445626",
  homeState: "KY",
  homeZip: "42701",
  LoRoCo: null,
  namesOnPrints: null,
  OnlineCode: "FM3411221609",
  paidHow: null,
  parentFirstName: "Jennifer",
  parentLastName: "Jennifer",
  referenceNumber: "021-726-MTWR2",
  relationshipToStudent: null,
  Season_External_Reference: "Spring Proof 2020-2021",
  Shipping_Discount: "0",
  Shipping_Method: null,
  studentFirstName: "Naomi",
  studentID: "2120862420",
  studentLastName: "Morgan",
  teacher: "Nelson",
  TM: "GC",
};

request.post(
  {
    url: "http://localhost:3000/loroco_test",
    body: json,
    json: true,
  },
  function (error, response, body) {
    console.log(body);
  }
);

const request = require('request');

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// example json to test insertion to DB
const json = [{
  _fknShootNumber: "341122",
  _fktCustomerNo: "113818",
  _fktPackage: null,
  clientName: "G C Burkhead Elementary School",
  customerName: "Jennifer Hale",
  dateIn: formatDate("2021-07-26T00:16:22+00:00"),
  emailAddress: "jlhale87@gmail.com",
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
  seasonExternalReference: "Spring Proof 2020-2021",
  shippingDiscount: "0",
  shippingMethod: null,
  studentFirstName: "Naomi",
  studentID: "2120862420",
  studentLastName: "Morgan",
  teacher: "Nelson",
  TM: "GC",
},
{
    _fknShootNumber: "285948",
    _fktCustomerNo: "146897",
    _fktPackage: null,
    clientName: "G C Burkhead Elementary School",
    customerName: "commander shephard",
    dateIn: formatDate("2021-07-26T00:16:22+00:00"),
    emailAddress: "jlhale87@gmail.com",
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
    seasonExternalReference: "Spring Proof 2020-2021",
    shippingDiscount: "0",
    shippingMethod: null,
    studentFirstName: "Naomi",
    studentID: "2120862420",
    studentLastName: "Morgan",
    teacher: "Nelson",
    TM: "GC",
  }];

request.post({
    url: 'http://localhost:3000/loroco_test',
    body: json,
    json: true,
}, function (error, response, body) {
    // console.log(body);
});
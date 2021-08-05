require("dotenv").config({ path: "../.ENV" });
const axios = require("axios");
const request = require("request");

orderIDList = [
  "01FC4JERK892PB0HWZB10BD0TJ",
  "01FC4N13ZJJTB57094XPKNG5G3",
  "01FC4N3NRNB22GM1JSZJ8WDE3F",
  "01FC4C6HTP6BH2Q7ZE6RE89FTH",
  "01FC4MKWYZYW1M8V5V3PNY59RC",
  "01FC4NZQM1P30X1VAF584CCXPM",
  "01FC4P4856A912HS2MZ63PSF5K",
  "01FC4NW247Z6NMH3P805AQ70ZW",
  "01FC4PN9719SFRN1ZFD76C4WSC",
  "01FC4PQGQ5AJKJT8XMCZBKZ1SA",
  "01FC4PZGG2HYKZC2AE9JGD3VGK",
  "01FBYKXWWXGXS86S2FS0CE1CMM",
  "01FC4Q1F3AEFTGDD11PFZRTRBM",
  "01FC4Q8PGX52XVSV8N73NXDVC5",
  "01FC3W0X50EJ1GM1S0J2Y897JF",
  "01FC4QF5QD3DD6W8V13SHRNJ1V",
  "01FC4QQAFYFPZF18MFGRR29EJJ",
  "01FC4Q46CZN3GCZKPV9RCJPANS",
  "01FC4QMHFSJ0G6JPHE5S70XVV4",
  "01FC4QHM3MCNDT49T77MPP228Q",
  "01FC4QQDWGX7QJDTHA6H48GRQF",
  "01FC4R3VY6HJN7BF2X626MKKM8",
  "01FC4NNYNVB3KY7T54GMZD9ZPX",
  "01FC4RX9RXAAS8V5PKWDX1HA6Q",
  "01FC4RRZCX4BRD8HM0V1XZFNKD",
  "01FAEXKSGMKRD8QMX2S6VJD2NB",
  "01FC4T38SRVPMY7RWFSWF2Z24E",
  "01FC4SVVW0M4P9WSZK5YB38YY0",
  "01FC4T970C5AJW8S5NPQ5CJA85",
  "01FAXH7FH4E1PH3Q99RVAEDF3X",
  "01FC4THY3EY2PVNFT7YWNW651B",
  "01FC4V1671KHWZHSKTD6RPEMQR",
  "01FC4VNBHHA0820RS7C2VC9AFE",
  "01FC4VXE6J29P4TTRA0H2Y531A",
  "01FC4W2FS1S9A8FCF36NXZ7BT4",
  "01FC4W5WS476E7G9DV1VNV09QD",
  "01FC4W524N1SQXH6Y6C0BQNWY1",
  "01FC4QWTQZ2A8XVPQDHV5H5KYN",
  "01FC4WCANQCX09TR1NFEY6KVGQ",
  "01FC4W3ME6WDYA6P6NP67B7V21",
  "01FC4WQK6063YGNPNHHMQHYHNG",
  "01FC4WWJ1BJ0QK3ZWSGFKEA3BD",
  "01FC4WKNAPZ3CY4AGBCYV55SRG",
  "01FC4Y0569YGQJQD0A42HZTRAE",
  "01FC4S407QA1HZ22S48B55B8G5",
  "01FC4WVDYT67YZTD24AEKA3612",
  "01FC4YPKCYFG5ED9VMMSRF1RNM",
  "01FC4ZBV2KX98PQVH7KKHMRXZE",
  "01FC50CDPXTTDXVDKJMDABKDVF",
  "01FC50V4NC8TKQ0DMV33C1AS05",
  "01FC516YMTHZHPP0061AE9K5CM",
  "01FC51C8MYBG0DWJXGKESQNZN7",
  "01FC502PJ92MXRWVJA08GJ5AEJ",
  "01FC2EBNJSW6WNC4XB9GXEH0GQ",
  "01FC58HVEZZA5CPEEC9CCMWQXC",
  "01FC5V31108833M78EGVZ5NMVD",
  "01FC5SKAX8AMHF9JG6WEEZ7CP1",
  "01FC5VYHXZSZ12K8B4MGQ98WDW",
  "01FC5VZ9CFY03R3B503H9HPTXP",
  "01FC5WDSASW90CVZYQ61NGY5ER",
  "01FC5WHSD225Z0FEJJ74PKX860",
  "01FC5VZR2BW47TGYK154BV42VZ",
  "01FC5W90WG6KQSZJGW245KCX2J",
  "01FC5WJ68N8PG6YSSFH81G2X7T",
  "01FC5WKEX4P3SE6B784MDBKQNC",
  "01FC3X2GB50BKT9EANGNRC8BZ5",
  "01FC5X000DJ35SMF2WG8PMGVS6",
  "01FC5X06KPGXRFJQZJRF827MJV",
  "01FC5XBC2M7E7GQ50XJNX49QZR",
  "01FC5XJCVK1V63R7BWF3M2D5QG",
  "01FC5XPHG4HYMT24GHWP0TYFE7",
  "01FC5Y34VSHZNJF5HF5AXWDF8T",
  "01FC5Y8GWVJ67X81JJJ8VE3N14",
  "01FC5Y8STRFS1P570NK4GR9FB7",
  "01FC5YAQ61YDKGQ53CDKPY7203",
  "01FC5YH32PW8MCEWW1EYYZ92MM",
  "01FC5YJ7H4PRDPBGM9SC21C63T",
  "01FC5YSA61XJ0MBR3W8CFWK40Y",
  "01FC5YK0HT5KKYV904VP6WY3RJ",
  "01FC5Z0AZ44KQ8641G9BSNGC9S",
  "01FC5Z0WV5HTVB2K9HHWZQRAKS",
  "01FC5ZC869BZVSYEDPHE3CFZCH",
  "01FC5ZNTQ1AAR0CVH4XP9J0RWP",
  "01FC6048M23RQDKH5G2KKY1P7M",
  "01FC60B85YQ62W7PEP9R9WZJJQ",
  "01FC60S3T1XWQJ3Y1JPND7ZFW8",
  "01FC60TDS9RHPV7BWAD1JY9MTF",
  "01FC60SY4GY5R68D4RBDDQM19M",
  "01FC61DJHA9Y0VB3AAD18P0V6J",
  "01FC61S4T62JQ806DD1874440W",
  "01FC61RNRV520AGN21NFX5AAHR",
  "01FC61VY321JMCMNPBJD9E5QTM",
  "01FC628E30NF3G4NERPQAEHRHQ",
  "01FC4DVJ0FPNQY6W36WPMPHPTE",
  "01FC62V92JKS3XY9R414FHJTC6",
  "01FC632WHM4DBQEJSWNGWRZP6P",
  "01FC63BN1B3Q514GNJXHT3EWN5",
  "01FC63JPSREKQ8FYYDKND3V6QR",
  "01FC63G9V0JDKTCRMJJSJZKQFY",
  "01FC63H8F14YS1GYJR05XDH25V",
];

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

async function sendResults(undefinedOrders) {
  for (let i = 0; i < orderIDList.length; i++) {
    let order_id = orderIDList[i];
    data = await getOrderLab(order_id);
    let result = await processOrders(data);
  }
  console.log(
    "Posting to Database, the number of undefined orders was: ",
    undefinedOrders.length
  );
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

sendResults(undefinedOrders);

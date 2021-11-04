require('dotenv').config({ path: '../.ENV' });
const axios = require('axios');
const request = require('request');
const helperOBJ = require('../helpers/optionObjects');

const orders = [];

const orderIdList = [
  '01FKKPVN9B0V7EZB185QS8XN01',
  '01FKKQ480AR6FVWPPMVTMGYDJT',
  '01FKKQ8MF47M08XZRTJ3E1GFQN',
  '01FKKQBQEGB3QMN64ZYZSJK8Q4',
  '01FKKQE0AKVBRD4P7MZGMXF4QK',
  '01FKKQG1JEDQT1A2RNZQNHCVDG',
  '01FKKQJ5D8R4NRKBR2EYHB9NY9',
  '01FKKQM47TAQ2FPMERANB9A4DY',
  '01FKKQNSYX9VHN0TFF3FZ8BD9V',
  '01FKKQQHR554PG6MSPQEB23BHR',
  '01FKKQSBJFPRBJ6EZDPA9S90NB',
  '01FKKQV68F20T3C8C8MSZQJH1K',
  '01FKKQXG0QA41G5F03BB81Y5RG',
];

function formatRelationship(string) {
  studString = string;
  if (studString == null) {
    result = null;
  } else {
    result = studString.replace(
      studString,
      (m) => helperOBJ.studentRelationship[m],
    );
  }
  return result;
}

function formatGrade(string) {
  gradeString = string;
  if (gradeString == null) {
    result = null;
  } else {
    result = gradeString.replace(
      gradeString,
      (m) => helperOBJ.gradeMap[m],
    );
  }
  return result;
}

function formatSport(string) {
  sportString = string;
  if (sportString == null) {
    result = null;
  } else {
    result = sportString.replace(
      sportString,
      (m) => helperOBJ.sportsMap[m],
    );
  }
  return result;
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

/**
 * finds the amount of objects in an object
 * @param {object} obj
 * @returns
 */
function objectLength(obj) {
  let result = 0;
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      result++;
    }
  }
  return result;
}

/**
 *
 * @returns {number} paperLength - width of all items in an order
 */
async function findPaperLength() {
  let packagePaperLength = 0;
  let orderPaperLength = 0;
  let paperLength = 0;
  let packageLength = objectLength(data?.order?.orderItems);
  console.log(packageLength);
  for (let i = 0; i < packageLength; i++) {
    let orderLength = objectLength(
      data?.order?.orderItems[i]?.orderItems,
    );
    let packageQuantity = data?.order?.orderItems[i]?.quantity ?? 0;
    let packageWidth = data?.order?.orderItems[i].product.width ?? 0;
    packageSubtotal = packageQuantity * packageWidth;
    packagePaperLength += packageSubtotal;
    for (let y = 0; y < orderLength; y++) {
      let orderQuantity =
        data?.order?.orderItems[i]?.orderItems[y]?.quantity ?? 0;
      let orderWidth =
        data?.order?.orderItems[i]?.orderItems[y]?.product?.width ??
        0;
      orderSubtotal = orderQuantity * orderWidth * packageQuantity;
      orderPaperLength += orderSubtotal;
    }
  }
  if (packageLength > 1) {
    paperLength = packagePaperLength + orderPaperLength;
  } else {
    paperLength = packagePaperLength;
  }
  return paperLength;
}

/**
 *
 * @param {string} order_id ID of order to be used for API call
 * @returns {object} res.data response from Fotomerchant
 */
async function getOrderLab(order_id) {
  console.log('Starting Get Order Lab call for: ', order_id);
  let param_url = new URL(
    `https://api.fotomerchanthv.com/orders/${order_id}/lab`,
  );
  // let param_url = new URL(
  //   `https://api.staging.fotomerchanthv.com/orders/${order_id}/lab`,
  // );

  const config = {
    method: 'get',
    url: param_url.href,
    headers: {
      Authorization: process.env.FM_API_KEY,
      // Authorization: process.env.FM_STAGE_API_KEY,
    },
  };

  try {
    let res = await axios(config);
    if (res.status == 200) {
      console.log('Order Call successful...');
    }
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Sets batchCategory based off values from the response
 * @returns {string} batch - batchCategory value
 */
async function setBatchCategory() {
  const fmhvSeason =
    data?.order?.clientSession?.season?.label ?? null;
  const fmhvShipCode = data?.order?.shippingMethod?.code ?? null;
  const shippingMethod = data?.order?.shippingMethod?.label ?? null;
  const fmhvPaymentMethod = data?.order?.paymentMethod ?? null;
  const fmhvStage = data?.order?.clientSessionStage?.label ?? null;
  const _fktPackage = data?.order?.orderPackageString ?? null;
  const imageOption = data?.order?.orderImageOptionsString ?? null;
  batch = 'To Loroco';
  const postPictureDayArr = [
    'ORDER_FEE',
    'CCG_ORDER_FEE',
    'PPD_$5',
    'Spec_Reorder',
  ];
  const shipToHomeArr = [
    'SPORT_ORDER',
    'UC_REORDER',
    'UC_LATE_ORDER',
  ];
  if (
    (fmhvSeason !== null && fmhvSeason.includes('Senior')) ||
    (fmhvSeason !== null && fmhvSeason.includes('Year'))
  ) {
    batch = 'Main Production';
  } else if (
    (shippingMethod !== null &&
      shippingMethod.includes('Pay to Keep')) ||
    (shippingMethod !== null &&
      shippingMethod.includes('Plan C Processing Fee')) ||
    (shippingMethod !== null &&
      shippingMethod.includes('Ship to School'))
  ) {
    batch = 'Main Production';
  } else if (shippingMethod === null && fmhvShipCode === null) {
    if (_fktPackage !== null && _fktPackage.charAt(0) === 'O') {
      batch = 'Main Production';
    } else if (
      (_fktPackage !== null && _fktPackage.includes('ENTIRE_PKG_')) ||
      (_fktPackage !== null && _fktPackage.includes('SPEC_SHEETS'))
    ) {
      batch = 'Main Production';
    }
  } else if (
    (fmhvShipCode !== null && fmhvShipCode === 'KEEP_NO CHARGE') ||
    (fmhvShipCode !== null && fmhvShipCode === 'PLAN_C_SHIP_HOME') ||
    (fmhvShipCode !== null && fmhvShipCode === 'SHIP_SCHOOL')
  ) {
    batch = 'Main Production';
  } else if (fmhvPaymentMethod === null) {
    batch = 'Main Production';
  } else if (fmhvStage !== null && fmhvStage.includes('AUTO')) {
    if (
      _fktPackage !== null &&
      !_fktPackage.includes('DIST_') &&
      imageOption !== null &&
      !imageOption.includes('AB')
    ) {
      batch = 'Automation';
    } else if (
      _fktPackage !== null &&
      _fktPackage.includes('DIST_') &&
      imageOption !== null &&
      !imageOption.includes('AB')
    ) {
      batch = 'Automation Novelty';
    } else if (
      _fktPackage !== null &&
      !_fktPackage.includes('DIST_') &&
      imageOption !== null &&
      imageOption.includes('AB')
    ) {
      batch = 'Automation Retouch';
    } else if (
      _fktPackage !== null &&
      _fktPackage.includes('DIST_') &&
      imageOption !== null &&
      imageOption.includes('AB')
    ) {
      batch = 'Automation Novelty Retouch';
    }
  } else if (
    shippingMethod !== null &&
    shippingMethod.includes('Ship to Home')
  ) {
    if (fmhvStage.includes('1')) {
      batch = 'Main Production';
    } else if (shipToHomeArr.includes(fmhvShipCode)) {
      batch = 'To Loroco';
    } else if (!shipToHomeArr.includes(fmhvShipCode)) {
      batch = 'To Loroco with Issue';
    }
  } else if (
    shippingMethod !== null &&
    shippingMethod.includes('Post Picture Day Order Fee')
  ) {
    if (fmhvStage.includes('1')) {
      batch = 'To Loroco with Issue';
    } else if (postPictureDayArr.includes(fmhvShipCode)) {
      batch = 'To Loroco';
    } else if (!postPictureDayArr.includes(fmhvShipCode)) {
      batch = 'To Loroco with issue';
    }
  } else {
    batch = 'To Loroco';
  }
  return batch;
}

/**
 * Pulls the data we need for our records from response
 * God bless optional chaining and nullish coalescing.
 * @param {object} data returned from API Call
 * @returns
 */
async function processOrders(data) {
  const orderID = data?.order?.id ?? null;
  const _fknShootNumber =
    data?.order?.clientSession?.externalReference ?? null;
  const _fktCustomerNo =
    data?.order?.clientSession?.client?.externalReference ?? null;
  const _fktPackage = data?.order?.orderPackageString ?? null;
  const clientName =
    data?.order?.clientSession?.client?.label ??
    data?.order?.orderFormEntrys[0]?.values[
      '01FDDDZDDT9QHNJZTF98J31X60'
    ] ?? // sports form FAIWPO2JMM-8B2-CW31LJ
    null;
  const customerName = data?.order?.recipientName ?? null;
  const emailAddress = data?.order?.recipientEmail ?? null;
  const fmhvCategory =
    data?.order?.clientSession?.clientSessionCategory?.label ?? null;
  const fmhvPackageCost = data?.order?.subTotal ?? null;
  const fmhvPaymentMethod = data?.order?.paymentMethod ?? null;
  const fmhvSeason =
    data?.order?.clientSession?.season?.label ?? null;
  const fmhvSession = data?.order?.clientSession?.label ?? null;
  const fmhvShipCode = data?.order?.shippingMethod?.code ?? null;
  const fmhvShipCost = data?.order?.shippingTotal ?? null;
  const fmhvStage = data?.order?.clientSessionStage?.label ?? null;
  const fmhvTotal = data?.order?.total ?? null;
  const grade =
    data?.order?.subject?.grade ??
    data?.order?.orderFormEntrys[0]?.values[
      'F98OL37WDL-9AM-LVRZG4'
    ] ?? // school info form
    null;
  const graduationYear =
    data?.order?.orderItems[0]?.orderItemOptions[1]?.value ?? null;
  const homeAddress = data?.order?.shippingAddress?.address1 ?? null;
  const homeAddress2 = data?.order?.shippingAddress?.address2 ?? null;
  const homeCity = data?.order?.shippingAddress?.city ?? null;
  const homePhone1 = data?.order?.shippingAddress?.phone ?? null;
  const homeState = data?.order?.shippingAddress?.stateLabel ?? null;
  const homeZip = data?.order?.shippingAddress?.zipCode ?? null;
  const onlineCode = data?.order?.subject?.password ?? null;
  const parentFirstName =
    data?.order?.shippingAddress?.firstName ??
    data?.order?.billingAddress?.firstName ??
    null;
  const parentLastName =
    data?.order?.shippingAddress?.lastName ??
    data?.order?.billingAddress?.lastName ??
    null;
  const referenceNumber = data?.order?.orderReference ?? null;
  const relationshipToStudent =
    data?.order?.orderFormEntrys[0]?.values[
      'F99T5BZIXA-QGT-NB2EOO'
    ] ?? null; // school info form F98OL37KKK-RFT-44F87S
  const seasonExternalReference =
    data?.order?.clientSession?.season?.externalReference ?? null;
  const shippingDiscount = data?.order?.couponDiscountTotal ?? null;
  const shippingMethod = data?.order?.shippingMethod?.label ?? null;
  const studentFirstName =
    data?.order?.subject?.firstName ??
    data?.order?.orderFormEntrys[0]?.values[
      'F98OL37Q49-6MA-3EBIV8'
    ] ?? // school info form F98OL37KKK-RFT-44F87S
    data?.order?.orderFormEntrys[0]?.values[
      'FAIWPO2NJ4-E9K-PL1I0Y'
    ] ?? // sports form FAIWPO2JMM-8B2-CW31LJ
    null;
  const studentID = data?.order?.subject?.subjectId ?? null;
  const studentLastName =
    data?.order?.subject?.lastName ??
    data?.order?.orderFormEntrys[0]?.values[
      'F99TE8YU8F-R88-CSNKAM'
    ] ?? // school info form F98OL37KKK-RFT-44F87S
    data?.order?.orderFormEntrys[0]?.values[
      'FAIWV436HI-I07-DO5SSQ'
    ] ?? // sports form FAIWPO2JMM-8B2-CW31LJ
    null;
  const teacher =
    data?.order?.subject?.teacher ??
    data?.order?.orderFormEntrys[0]?.values[
      'F98OL37QJ1-Y5M-DPEU7K'
    ] ?? // school info form F98OL37KKK-RFT-44F87S
    null;
  const TM =
    data?.order?.clientSession?.client?.territoryCode ?? null;
  const dateCreated = data?.order?.createdAt ?? null;
  const dateModified = data?.order?.modifiedAt ?? null;
  const namesOnPrints =
    data?.order?.orderItems[3]?.orderItemOptions[0]?.value ??
    data?.order?.orderItems[0]?.orderItemOptions[0]?.value ??
    null;
  const age =
    data?.order?.orderFormEntrys[0]?.values[
      'FBKHP2B4OK-VDG-613IP6'
    ] ?? null; // sports form FAIWPO2JMM-8B2-CW31LJ
  const sport =
    data?.order?.orderFormEntrys[0]?.values[
      'FAIWV436TF-YHV-GXAIEG'
    ] ?? null; // sports form FAIWPO2JMM-8B2-CW31LJ
  const teamName =
    data?.order?.orderFormEntrys[0]?.values[
      'FAIWV4374O-PR4-84T6NU'
    ] ?? null; // sports form FAIWPO2JMM-8B2-CW31LJ
  const coach =
    data?.order?.orderFormEntrys[0]?.values[
      'FAIWV437FQ-PAA-9N7GS9'
    ] ?? null; // sports form FAIWPO2JMM-8B2-CW31LJ
  const jerseyNumber =
    data?.order?.orderFormEntrys[0]?.values[
      '01EXHTW1QVV693FP129G1R38HE'
    ] ?? null; // sports form FAIWPO2JMM-8B2-CW31LJ
  const paperLength = await findPaperLength();
  const batchCategory = await setBatchCategory();
  const imageOption = data?.order?.orderImageOptionsString ?? null;

  // These will not be from FM response, but we're filling them in regardless
  const datePulled = Date.now();
  const batchID = null;
  const lorocoNumber = null;
  const batchSequence = null;

  try {
    const finalPayload = {
      orderID: orderID,
      _fknShootNumber: _fknShootNumber,
      _fktCustomerNo: _fktCustomerNo,
      _fktPackage: _fktPackage,
      clientName: clientName,
      customerName: customerName,
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
      relationshipToStudent: formatRelationship(
        relationshipToStudent,
      ),
      seasonExternalReference: seasonExternalReference,
      shippingDiscount: shippingDiscount,
      shippingMethod: shippingMethod,
      studentFirstName: studentFirstName,
      studentID: studentID,
      studentLastName: studentLastName,
      teacher: teacher,
      TM: TM,
      dateCreated: formatDate(dateCreated),
      dateModified: formatDate(dateModified),
      datePulled: formatDate(datePulled),
      age: age,
      sport: formatSport(sport),
      teamName: teamName,
      coach: coach,
      jerseyNumber: jerseyNumber,
      batchID: batchID,
      batchCategory: batchCategory,
      lorocoNumber: lorocoNumber,
      batchSequence: batchSequence,
      paperLength: paperLength,
      imageOption: imageOption,
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
        url: 'http://localhost:3000/orders',
        body: orders,
        json: true,
      },
      function (error, response, body) {
        console.log(error);
      },
      console.log('Posting to Database'),
    );
    return;
  }
}

sendResults(orderIdList);

module.exports = { getOrderLab, processOrders, sendResults };

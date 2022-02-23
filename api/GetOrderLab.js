const axios = require('axios');
require('dotenv').config({ path: '../.ENV' });
const orderList = require('./orderList');
const {
  formatRelationship,
  formatGrade,
  formatSport,
  formatDate,
} = require('../helpers/formatFunctions');

axios.defaults.headers.common['Authorization'] =
  process.env.FM_API_KEY;

axios.defaults.headers.common['User-Agent'] =
  'Strawbridge-Automation';

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
 * Sets batchCategory based off values from the response
 * @returns {string} batch - batchCategory value
 */
// function setBatchCategory(data) {
//   const fmhvSeason =
//     data?.order?.clientSession?.season?.label ?? null;
//   const fmhvShipCode = data?.order?.shippingMethod?.code ?? null;
//   const shippingMethod = data?.order?.shippingMethod?.label ?? null;
//   const fmhvPaymentMethod = data?.order?.paymentMethod ?? null;
//   const fmhvStage = data?.order?.clientSessionStage?.label ?? null;
//   const _fktPackage = data?.order?.orderPackageString ?? null;
//   const imageOption = data?.order?.orderImageOptionsString ?? null;
//   batch = 'To Loroco';
//   const postPictureDayArr = [
//     'ORDER_FEE',
//     'CCG_ORDER_FEE',
//     'PPD_$5',
//     'Spec_Reorder',
//   ];
//   const shipToHomeArr = [
//     'SPORT_ORDER',
//     'UC_REORDER',
//     'UC_LATE_ORDER',
//   ];
//   if (
//     (fmhvSeason !== null && fmhvSeason.includes('Senior')) ||
//     (fmhvSeason !== null && fmhvSeason.includes('Year'))
//   ) {
//     batch = 'Main Production';
//   } else if (
//     (shippingMethod !== null &&
//       shippingMethod.includes('Pay to Keep')) ||
//     (shippingMethod !== null &&
//       shippingMethod.includes('Plan C Processing Fee')) ||
//     (shippingMethod !== null &&
//       shippingMethod.includes('Ship to School'))
//   ) {
//     batch = 'Main Production';
//   } else if (shippingMethod === null && fmhvShipCode === null) {
//     if (_fktPackage !== null && _fktPackage.charAt(0) === 'O') {
//       batch = 'Main Production';
//     } else if (
//       (_fktPackage !== null && _fktPackage.includes('ENTIRE_PKG_')) ||
//       (_fktPackage !== null && _fktPackage.includes('SPEC_SHEETS'))
//     ) {
//       batch = 'Main Production';
//     }
//   } else if (
//     (fmhvShipCode !== null && fmhvShipCode === 'KEEP_NO CHARGE') ||
//     (fmhvShipCode !== null && fmhvShipCode === 'PLAN_C_SHIP_HOME') ||
//     (fmhvShipCode !== null && fmhvShipCode === 'SHIP_SCHOOL')
//   ) {
//     batch = 'Main Production';
//   } else if (fmhvPaymentMethod === null) {
//     batch = 'Main Production';
//   } else if (fmhvStage !== null && fmhvStage.includes('AUTO')) {
//     if (
//       _fktPackage !== null &&
//       !_fktPackage.includes('DIST_') &&
//       imageOption !== null &&
//       !imageOption.includes('AB')
//     ) {
//       batch = 'Automation';
//     } else if (
//       _fktPackage !== null &&
//       _fktPackage.includes('DIST_') &&
//       imageOption !== null &&
//       !imageOption.includes('AB')
//     ) {
//       batch = 'Automation Novelty';
//     } else if (
//       _fktPackage !== null &&
//       !_fktPackage.includes('DIST_') &&
//       imageOption !== null &&
//       imageOption.includes('AB')
//     ) {
//       batch = 'Automation Retouch';
//     } else if (
//       _fktPackage !== null &&
//       _fktPackage.includes('DIST_') &&
//       imageOption !== null &&
//       imageOption.includes('AB')
//     ) {
//       batch = 'Automation Novelty Retouch';
//     }
//   } else if (
//     shippingMethod !== null &&
//     shippingMethod.includes('Ship to Home')
//   ) {
//     if (fmhvStage.includes('1')) {
//       batch = 'Main Production';
//     } else if (shipToHomeArr.includes(fmhvShipCode)) {
//       batch = 'To Loroco';
//     } else if (!shipToHomeArr.includes(fmhvShipCode)) {
//       batch = 'To Loroco with Issue';
//     }
//   } else if (
//     shippingMethod !== null &&
//     shippingMethod.includes('Post Picture Day Order Fee')
//   ) {
//     if (fmhvStage.includes('1')) {
//       batch = 'To Loroco with Issue';
//     } else if (postPictureDayArr.includes(fmhvShipCode)) {
//       batch = 'To Loroco';
//     } else if (!postPictureDayArr.includes(fmhvShipCode)) {
//       batch = 'To Loroco with issue';
//     }
//   } else {
//     batch = 'To Loroco';
//   }
//   return batch;
// }

/**
 * Sets batchCategory based off values from the response
 * @returns {string} batch - batchCategory value
 */
function setBatchCategory(data) {
  const fmhvSeason =
    data?.order?.clientSession?.season?.label ?? null;
  const fmhvPaymentMethod = data?.order?.paymentMethod ?? null;
  const fmhvStage = data?.order?.clientSessionStage?.label ?? null;
  const _fktPackage = data?.order?.orderPackageString ?? null;
  const imageOption = data?.order?.orderImageOptionsString ?? null;
  const homeZip = data?.order?.shippingAddress?.zipCode ?? null;
  const isSubject = data.order.subject;
  const fulfillmentState =
    data?.order?.directFulfillmentState ?? null;
  const imageName = data?.order?.images[0]?.originalFilename ?? null;
  const fulfillmentStatus =
    data?.order?.directFulfillmentStatus ?? null;

  batch = 'To Loroco';

  if (
    (fmhvSeason !== null && fmhvSeason.includes('Senior')) ||
    (fmhvSeason !== null && fmhvSeason.includes('Year'))
  ) {
    batch = 'Main Production'; // 1 & 2
  } else if (fmhvPaymentMethod === null) {
    batch = 'Main Production'; // 3
  } else if (homeZip === null) {
    batch = 'Main Production'; // 4
  } else if (
    fmhvStage !== null &&
    fmhvStage.includes('Wholesale Reorder')
  ) {
    batch = 'To Loroco'; // 5
  } else if (homeZip !== null && fmhvStage.includes('1.')) {
    batch = 'Main Production'; // 6
  } else if (
    fulfillmentState !== null &&
    fulfillmentState == 'STATE_NONE'
  ) {
    batch = 'To Loroco'; // step 7
  } else if (
    imageName !== null &&
    imageName.includes('Placeholder')
  ) {
    batch = 'To Loroco'; // step 7
  } else if (fmhvStage !== null && fmhvStage.includes('AUTO')) {
    if (isSubject === undefined) {
      batch = 'To Loroco';
    } else if (
      _fktPackage !== null &&
      !_fktPackage.includes('DIST_') &&
      imageOption !== null &&
      !imageOption.includes('AB')
    ) {
      batch = 'Automation'; // 7a
    } else if (
      _fktPackage !== null &&
      _fktPackage.includes('DIST_') &&
      imageOption !== null &&
      !imageOption.includes('AB')
    ) {
      batch = 'Automation Novelty'; // 7b
    } else if (
      _fktPackage !== null &&
      !_fktPackage.includes('DIST_') &&
      imageOption !== null &&
      imageOption.includes('AB')
    ) {
      batch = 'Automation Retouch'; // 7c
    } else if (
      _fktPackage !== null &&
      _fktPackage.includes('DIST_') &&
      imageOption !== null &&
      imageOption.includes('AB')
    ) {
      batch = 'Automation Novelty Retouch'; // 7d
    }
  } else {
    batch = 'To Loroco'; // 11
  }
  return batch;
}

/**
 *
 * @returns {number} paperLength - width of all items in an order
 */
function findPaperLength(data) {
  let packagePaperLength = 0;
  let orderPaperLength = 0;
  let paperLength = 0;
  let packageLength = objectLength(data?.order?.orderItems);

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
    paperLength = orderPaperLength;
  }
  return paperLength;
}

/**
 * remove unicode from strings
 * @param {string} text
 * @returns
 */
function stripEmojis(text) {
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    '',
  );
}

function processOrders(data) {
  let result = [];

  for (let i = 0; i < data.length; i++) {
    // take all this crap and rewrite it into a function we can pass here that returns payload
    const orderID = data[i]?.order?.id ?? null;
    const _fknShootNumber =
      data[i]?.order?.clientSession?.externalReference ?? null;
    const _fktCustomerNo =
      data[i]?.order?.clientSession?.client?.externalReference ??
      null;
    let _fktPackage = data[i]?.order?.orderPackageString ?? null;
    const clientName =
      data[i]?.order?.clientSession?.client?.label ??
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01FDDDZDDT9QHNJZTF98J31X60'
      ] ?? // sports form FAIWPO2JMM-8B2-CW31LJ
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01F24R2822D0Q0W9YSPTFBWB1G'
      ] ?? // Journey form 01F24R281FV4Z18211EV4892AR
      null;
    const customerName = data[i]?.order?.recipientName ?? null;
    const emailAddress = data[i]?.order?.recipientEmail ?? null;
    const fmhvCategory =
      data[i]?.order?.clientSession?.clientSessionCategory?.label ??
      null;
    const fmhvPackageCost = data[i]?.order?.subTotal ?? null;
    const fmhvPaymentMethod = data[i]?.order?.paymentMethod ?? null;
    const fmhvSeason =
      data[i]?.order?.clientSession?.season?.label ?? null;
    const fmhvSession = data[i]?.order?.clientSession?.label ?? null;
    const fmhvShipCode = data[i]?.order?.shippingMethod?.code ?? null;
    const fmhvShipCost = data[i]?.order?.shippingTotal ?? null;
    const fmhvStage =
      data[i]?.order?.clientSessionStage?.label ?? null;
    const fmhvTotal = data[i]?.order?.total ?? null;
    const grade =
      data[i]?.order?.subject?.grade ??
      data[i]?.order?.orderFormEntrys[0]?.values[
        'F98OL37WDL-9AM-LVRZG4'
      ] ?? // school info form
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01EJEDZ7XS06J8ECPAT22P3P65'
      ] ?? // YB form {UID}
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01F251NVHPG4AECJYTS63GQ43B'
      ] ?? // Journey form 01F24R281FV4Z18211EV4892AR
      null;
    const graduationYear =
      data[i]?.order?.orderItems[0]?.orderItemOptions[1]?.value ??
      null;
    const homeAddress =
      data[i]?.order?.shippingAddress?.address1 ?? null;
    const homeAddress2 =
      data[i]?.order?.shippingAddress?.address2 ?? null;
    const homeCity = data[i]?.order?.shippingAddress?.city ?? null;
    const homePhone1 = data[i]?.order?.shippingAddress?.phone ?? null;
    const homeState =
      data[i]?.order?.shippingAddress?.stateLabel ?? null;
    const homeZip = data[i]?.order?.shippingAddress?.zipCode ?? null;
    const onlineCode = data[i]?.order?.subject?.password ?? null;
    const parentFirstName =
      data[i]?.order?.shippingAddress?.firstName ??
      data[i]?.order?.billingAddress?.firstName ??
      null;
    const parentLastName =
      data[i]?.order?.shippingAddress?.lastName ??
      data[i]?.order?.billingAddress?.lastName ??
      null;
    const referenceNumber = data[i]?.order?.orderReference ?? null;
    const relationshipToStudent =
      data[i]?.order?.orderFormEntrys[0]?.values[
        'F99T5BZIXA-QGT-NB2EOO'
      ] ?? // school info form F98OL37KKK-RFT-44F87S
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01EJEDZ7XY14T60C2RE7D59JPB'
      ] ?? // YB form {UID}
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01F24R2825H0M3R1TAS7HV664K'
      ] ?? // Journey form 01F24R281FV4Z18211EV4892AR
      null;
    const seasonExternalReference =
      data[i]?.order?.clientSession?.season?.externalReference ??
      null;
    const shippingDiscount =
      data[i]?.order?.couponDiscountTotal ?? null;
    const shippingMethod =
      data[i]?.order?.shippingMethod?.label ?? null;
    const studentFirstName =
      data[i]?.order?.subject?.firstName ??
      data[i]?.order?.orderFormEntrys[0]?.values[
        'F98OL37Q49-6MA-3EBIV8'
      ] ?? // school info form F98OL37KKK-RFT-44F87S
      data[i]?.order?.orderFormEntrys[0]?.values[
        'FAIWPO2NJ4-E9K-PL1I0Y'
      ] ?? // sports form FAIWPO2JMM-8B2-CW31LJ
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01EJEDZ7XBFC2R410NWMGAQKKK'
      ] ?? // YB form {UID}
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01F24R2820GW6SE8800N6182T9'
      ] ?? // Journey form 01F24R281FV4Z18211EV4892AR
      null;
    const studentID = data[i]?.order?.subject?.subjectId ?? null;
    const studentLastName =
      data[i]?.order?.subject?.lastName ??
      data[i]?.order?.orderFormEntrys[0]?.values[
        'F99TE8YU8F-R88-CSNKAM'
      ] ?? // school info form F98OL37KKK-RFT-44F87S
      data[i]?.order?.orderFormEntrys[0]?.values[
        'FAIWV436HI-I07-DO5SSQ'
      ] ?? // sports form FAIWPO2JMM-8B2-CW31LJ
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01EJEDZ7XD4PWC5YFDAWJA80BR'
      ] ?? // YB form {UID}
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01F24R2821D7EH08EHBJ50E0G2'
      ] ?? // Journey form 01F24R281FV4Z18211EV4892AR
      null;
    const teacher =
      data[i]?.order?.subject?.teacher ??
      data[i]?.order?.orderFormEntrys[0]?.values[
        'F98OL37QJ1-Y5M-DPEU7K'
      ] ?? // school info form F98OL37KKK-RFT-44F87S
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01EJEDZ7XD4PWC5YFDAWJA80BS'
      ] ?? // YB form {UID}
      null;
    const TM =
      data[i]?.order?.clientSession?.client?.territoryCode ?? null;
    const dateCreated = data[i]?.order?.createdAt ?? null;
    // const dateModified = data[i]?.order?.modifiedAt ?? null;
    const dateOrdered = data[i]?.order?.orderedAt ?? null;
    const namesOnPrints =
      data[i]?.order?.orderItems[3]?.orderItemOptions[0]?.value ??
      data[i]?.order?.orderItems[0]?.orderItemOptions[0]?.value ??
      null;
    const age =
      data[i]?.order?.orderFormEntrys[0]?.values[
        'FBKHP2B4OK-VDG-613IP6'
      ] ?? null; // sports form FAIWPO2JMM-8B2-CW31LJ
    const sport =
      data[i]?.order?.orderFormEntrys[0]?.values[
        'FAIWV436TF-YHV-GXAIEG'
      ] ?? null; // sports form FAIWPO2JMM-8B2-CW31LJ
    const teamName =
      data[i]?.order?.orderFormEntrys[0]?.values[
        'FAIWV4374O-PR4-84T6NU'
      ] ?? null; // sports form FAIWPO2JMM-8B2-CW31LJ
    const coach =
      data[i]?.order?.orderFormEntrys[0]?.values[
        'FAIWV437FQ-PAA-9N7GS9'
      ] ?? null; // sports form FAIWPO2JMM-8B2-CW31LJ
    const jerseyNumber =
      data[i]?.order?.orderFormEntrys[0]?.values[
        '01EXHTW1QVV693FP129G1R38HE'
      ] ?? null; // sports form FAIWPO2JMM-8B2-CW31LJ
    const paperLength = findPaperLength(data[i]);
    const batchCategory = setBatchCategory(data[i]);
    const imageOption =
      data[i]?.order?.orderImageOptionsString ?? null;

    // These will not be from FM response, but we're filling them in regardless
    const datePulled = Date.now();
    const batchID = null;
    const lorocoNumber = null;
    const batchSequence = null;

    // adding this to ignore problematic jobs that effect IM string
    if (fmhvSeason.includes('Senior')) {
      _fktPackage = null;
    }

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
      dateOrdered: formatDate(dateOrdered),
      dateCreated: formatDate(dateCreated),
      datePulled: formatDate(datePulled),
      age: age,
      sport: formatSport(sport),
      teamName: teamName ? stripEmojis(teamName) : teamName,
      coach: coach,
      jerseyNumber: jerseyNumber,
      batchID: batchID,
      batchCategory: batchCategory,
      lorocoNumber: lorocoNumber,
      batchSequence: batchSequence,
      paperLength: paperLength,
      imageOption: imageOption,
    };
    result.push(finalPayload);
  }

  return result;
}

function fetchOrder(order_id) {
  const url = `https://api.fotomerchanthv.com/orders/${order_id}/lab`;
  return axios.get(url).then((res) => res.data);
}

/**
 *
 * @param {array} items
 * @param {function} fn
 * @returns
 */
function all(items, fn) {
  const promises = items.map((item) => fn(item));
  return Promise.all(promises);
}

function series(items, fn) {
  let result = [];
  return items
    .reduce((acc, item) => {
      acc = acc.then(() => {
        return fn(item).then((res) => result.push(res));
      });
      return acc;
    }, Promise.resolve())
    .then(() => result);
}

function splitToChunks(items, chunkSize = 100) {
  const result = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize));
  }
  return result;
}

function orderChunks(items, fn, chunkSize = 100) {
  let result = [];
  const chunks = splitToChunks(items, chunkSize);
  return series(chunks, (chunk) => {
    return all(chunk, fn)
      .then((res) => (data = processOrders(res)))
      .then((data) => postToDB(data));
  }).then(() => console.log('done!'));
}

function postToDB(payload) {
  const url = `http://incdata.strawbridge.net/api/orders/orders/`;
  return axios
    .post(url, payload)
    .then((res) => console.log(res.data));
}

async function getOrderLabData(orderList) {
  console.log('starting get order lab calls');
  await orderChunks(orderList, fetchOrder);
}

// comment unless running manually
// getOrderLabData(orderList);

module.exports = { getOrderLabData };

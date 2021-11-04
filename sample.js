// var thing = 'eh';

async function test1() {
  const todoIdList = [1, 2, 3, 4];
  console.time('.map()');
  await Promise.all(
    todoIdList.map(async (id) => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
      );
      const todo = await response.json();
      console.log(todo.title);
    }),
  );
  console.timeEnd('.map()');
}

async function test2() {
  const todoIdList = [1, 2, 3, 4];
  console.time('for {}');
  for (const id of todoIdList) {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
    );
    const todo = await response.json();
    console.log(todo.title);
  }
  console.timeEnd('for {}');
}

test1();
test2();

// const orderIdList = [
//   '01FJFVYMQ24NNB04YVV2DR5R6J',
//   '01FJGC1JMHXDV48PE6PY5TQR26',
//   '01FJGC9E9K7ZVW2F5710BSR8NK',
//   '01FJGCFT82S45YK022ZBN052JX',
//   '01FJGDQPA911N84WQT3JWGZJMA',
//   '01FJGE5RHTGBZR5GEQH7KMYHMW',
//   '01FJGEF0T1XY03KXNKPKECKV93',
//   '01FJGEPGS4AXJ5TG6RETSZGYNG',
//   '01FJGEWQHAAWDX6HTJ620C69V0',
//   '01FJGF4C67H6F6Y98BEQ4V4ZJ5',
//   '01FJGF9A01B8PSYXGSQTDM83BN',
//   '01FJGFD87K6176XSH65NPDK94F',
//   '01FJGFHZ02EGW4H9CE320PX73X',
//   '01FJGFQHPEZZN9VHDQ26R0VVNN',
//   '01FJGFW6B132C6BEK2HCNGH502',
//   '01FJGG082EFWW7BXMBMGGAXS4R',
//   '01FJHQNH7Z97TWJXCSWGNWT5PQ',
//   '01FJHQVGA2ZC2HMYX72PQJ8MB0',
//   '01FJHTQ7B3THVMH33QJ82DXT90',
//   '01FJJ43D58M9QNZJW19Y198GXM',
//   '01FJJ4S9Y2VTMV4JAPK506DKMJ',
//   '01FJJ524BM1EVF4BC23DXV0YJY',
//   '01FJJ587HSYRA2XNBND2HHV8VN',
//   '01FJME179364T6H717MA9RHFZ5',
//   '01FJMQ52RG0KCV1K9MBX1DYT7G',
//   '01FJMQMYS47NCKVFXWW7RWNKZT',
// ];

// const orderIdList = [
//   '01FJZDH0FGWCJKFVFXX77HA0ZG',
//   '01FJZJQ6Z7T48X25DFDD1PANY7',
//   '01FJZM9YYB4WJ4X6XW0S4C9B78',
//   '01FJZMEX8Q3NCRA8EHC7GHCTNX',
//   '01FJZMKHRR7PW3YMSFV9FBNB5H',
//   '01FJZMRGXNKH23P1MRWGJ9KRKM',
//   '01FJZMWFVKYRCA4KSM48XKZ479',
//   '01FJZN4WX72C66XXGVT7XNSB77',
//   '01FJZN9ND69DHSWRYRVGDQRA16',
//   '01FJZNK22DWEE85W02NQCTFJAG',
//   '01FJZNNKNB7TS1F9ZXQ4N786YQ',
//   '01FJZNS257SJZ98WJWC8YG2YZQ',
//   '01FJZNVJJZQ9TR6ZTCQ25DMGXS',
//   '01FJZNY6F26DWZVFR4FE7M7QX0',
//   '01FJZP15X060Z77CMAT86VXNE5',
//   '01FJZP3N2E2395202SXZN0R1Q4',
//   '01FJZP61HR3Q62BQD2DYF6840Q',
//   '01FJZP8NTP6BK7NB7PZYR2WBEK',
//   '01FJZPC3S3K2CDQC9JFES5FVX5',
//   '01FJZPFQ8QMFVZX08QFJWW4GMM',
//   '01FJZQ13922QYX4XGGRATQJJH9',
//   '01FJZQ3K242KYWGWR9F29HJSCY',
//   '01FJZQ6Y8S4DC8BX3H5KX4NQC8',
//   '01FJZQ9V8Y7VW5Y9H78TVZCRQC',
//   '01FJZQD7SA6X3GDTWWDAJ79NW2',
//   '01FJZQR6PDQKEMNMFKC27PK5QH',
//   '01FJZQVXJYK7R3EFSN9J1XDZAD',
//   '01FJZQZYK6X0E99XBZJBHV5HP8',
//   '01FJZR36XV08MJK986BRC89TZ1',
//   '01FJZR6HXZSV9FE9C03QTJ609Z',
//   '01FJZR8VSACW1SZSFZKE67B4BM',
//   '01FJZRBS85CBCWR9WS7VDPC90V',
//   '01FJZREQR0QJHC4Z65B0GH45Z4',
//   '01FJZRHFAWW7ATV5123Y0C1NS6',
//   '01FJZRM1T54FTBMHNXAR2T208S',
//   '01FJZRQJG97J062JK8V7G548P6',
//   '01FJZRSWYA76S9E9AAZF4RK66Y',
//   '01FJZRZXA65YX3Z11SK2463SBM',
//   '01FJZS4VDWRS8CAFCW5SKS67HD',
//   '01FJZS993Q146S3MK3VF3GNW5J',
//   '01FJZSCFHSPSN4HMDD8J7VZM1D',
//   '01FJZSEWRF8Z0DJPX7CE8WB58R',
//   '01FJZSH5D3GQGWHF1RSXQKJ3S1',
//   '01FJZSN6TNFMX6AJDC268D2YBM',
//   '01FJZSQZ0GN24N3N2DRW1N1W85',
//   '01FJZSV1JV1AM1442474XJWRRP',
//   '01FJZSXWABEKAERQY57NF78ZHM',
//   '01FJZT28NQ8JQYHB23ZKDNS4KY',
//   '01FJZT5G6D47H0D5NFN5WHZHQQ',
//   '01FJZTD35PR4XN3CS48BX5HG2V',
//   '01FJZTGQFWZKJVP6V26P53TVW9',
//   '01FJZTNWPBFGFAJTCXT6WESKMW',
// ];

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
  // console.log(fmhvStage)
  // console.log(_fktPackage)
  // console.log(imageOption)
  // console.log(fmhvSeason)
  // console.log(shippingMethod)
  // console.log(fmhvShipCode)
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
      orderSubtotal = orderQuantity * orderWidth;
      orderPaperLength += orderSubtotal;
    }
  }
  // Per Roger, packagePaperLength is irrelevant, will keep this here
  // in case it becomes a surprise tool that will help us later.
  // paperLength = packagePaperLength + orderPaperLength;
  paperLength = orderPaperLength;
  return paperLength;
}

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
const fmhvSeason = data?.order?.clientSession?.season?.label ?? null;
const fmhvSession = data?.order?.clientSession?.label ?? null;
const fmhvShipCode = data?.order?.shippingMethod?.code ?? null;
const fmhvShipCost = data?.order?.shippingTotal ?? null;
const fmhvStage = data?.order?.clientSessionStage?.label ?? null;
const fmhvTotal = data?.order?.total ?? null;
const grade =
  data?.order?.subject?.grade ??
  data?.order?.orderFormEntrys[0]?.values['F98OL37WDL-9AM-LVRZG4'] ?? // school info form
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
  data?.order?.orderFormEntrys[0]?.values['F99T5BZIXA-QGT-NB2EOO'] ??
  null; // school info form F98OL37KKK-RFT-44F87S
const seasonExternalReference =
  data?.order?.clientSession?.season?.externalReference ?? null;
const shippingDiscount = data?.order?.couponDiscountTotal ?? null;
const shippingMethod = data?.order?.shippingMethod?.label ?? null;
const studentFirstName =
  data?.order?.subject?.firstName ??
  data?.order?.orderFormEntrys[0]?.values['F98OL37Q49-6MA-3EBIV8'] ?? // school info form F98OL37KKK-RFT-44F87S
  data?.order?.orderFormEntrys[0]?.values['FAIWPO2NJ4-E9K-PL1I0Y'] ?? // sports form FAIWPO2JMM-8B2-CW31LJ
  null;
const studentID = data?.order?.subject?.subjectId ?? null;
const studentLastName =
  data?.order?.subject?.lastName ??
  data?.order?.orderFormEntrys[0]?.values['F99TE8YU8F-R88-CSNKAM'] ?? // school info form F98OL37KKK-RFT-44F87S
  data?.order?.orderFormEntrys[0]?.values['FAIWV436HI-I07-DO5SSQ'] ?? // sports form FAIWPO2JMM-8B2-CW31LJ
  null;
const teacher =
  data?.order?.subject?.teacher ??
  data?.order?.orderFormEntrys[0]?.values['F98OL37QJ1-Y5M-DPEU7K'] ?? // school info form F98OL37KKK-RFT-44F87S
  null;
const TM = data?.order?.clientSession?.client?.territoryCode ?? null;
const dateCreated = data?.order?.createdAt ?? null;
const dateModified = data?.order?.modifiedAt ?? null;
const namesOnPrints =
  data?.order?.orderItems[3]?.orderItemOptions[0]?.value ??
  data?.order?.orderItems[0]?.orderItemOptions[0]?.value ??
  null;
const age =
  data?.order?.orderFormEntrys[0]?.values['FBKHP2B4OK-VDG-613IP6'] ??
  null; // sports form FAIWPO2JMM-8B2-CW31LJ
const sport =
  data?.order?.orderFormEntrys[0]?.values['FAIWV436TF-YHV-GXAIEG'] ??
  null; // sports form FAIWPO2JMM-8B2-CW31LJ
const teamName =
  data?.order?.orderFormEntrys[0]?.values['FAIWV4374O-PR4-84T6NU'] ??
  null; // sports form FAIWPO2JMM-8B2-CW31LJ
const coach =
  data?.order?.orderFormEntrys[0]?.values['FAIWV437FQ-PAA-9N7GS9'] ??
  null; // sports form FAIWPO2JMM-8B2-CW31LJ
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

console.log(batchCategory);

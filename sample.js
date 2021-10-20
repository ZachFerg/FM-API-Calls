async function setBatchCategory() {
  const fmhvSeason = null;
  const fmhvShipCode = null;
  const shippingMethod = 'Ship to Home';
  const fmhvPaymentMethod = 'Stripe';
  const fmhvStage = 'AUTO';
  const _fktPackage = 'D-1;BS,GA-1;AB-1;DIST_Sno_STD-2';
  let batch = '';
  if (
    (fmhvSeason !== null && fmhvSeason.includes('Senior')) ||
    (fmhvSeason !== null && fmhvSeason.includes('Year'))
  ) {
    console.log('this condition is true');
    batch = 'Main Production';
  } else if (
    (shippingMethod !== null &&
      shippingMethod.includes('Pay to Keep')) ||
    (shippingMethod !== null &&
      shippingMethod.includes('Plan C Processing Fee')) ||
    (shippingMethod !== null &&
      shippingMethod.includes('Ship to School'))
  ) {
    console.log('this condition is true');
    batch = 'Main Production';
  } else if (shippingMethod === null && fmhvShipCode === null) {
    if (
      (_fktPackage !== null && _fktPackage.includes('O-1')) ||
      (_fktPackage !== null && _fktPackage.includes('OA-1')) ||
      (_fktPackage !== null && _fktPackage.includes('O-1;BS')) ||
      (_fktPackage !== null && _fktPackage.includes('OA-1;BS'))
    ) {
      console.log('this condition is true');
      batch = 'Main Production';
    } else if (
      (_fktPackage !== null && _fktPackage.includes('ENTIRE_PKG_')) ||
      (_fktPackage !== null && _fktPackage.includes('SPEC_SHEETS'))
    ) {
      console.log('this condition is true');
      batch = 'Main Production';
    }
  } else if (
    (fmhvShipCode !== null && fmhvShipCode === 'KEEP_NO CHARGE') ||
    (fmhvShipCode !== null && fmhvShipCode === 'PLAN_C_SHIP_HOME') ||
    (fmhvShipCode !== null && fmhvShipCode === 'SHIP_SCHOOL')
  ) {
    console.log('this condition is true');
    batch = 'Main Production';
  } else if (fmhvPaymentMethod === null) {
    console.log('this condition is true');
    batch = 'Main Production';
  } else if (fmhvStage !== null && fmhvStage.includes('AUTO')) {
    if (
      _fktPackage !== null &&
      _fktPackage.includes('AB') &&
      !_fktPackage.includes('DIST_')
    ) {
      console.log('this condition is true');
      batch = 'Automation Retouch';
    } else if (
      _fktPackage !== null &&
      !_fktPackage.includes('AB') &&
      !_fktPackage.includes('DIST_')
    ) {
      console.log('this condition is true');
      batch = 'Automation';
    } else if (
      _fktPackage !== null &&
      !_fktPackage.includes('AB') &&
      _fktPackage.includes('DIST_')
    ) {
      console.log('this condition is true');
      batch = 'Automation Novelty';
    } else if (
      _fktPackage !== null &&
      _fktPackage.includes('AB') &&
      _fktPackage.includes('DIST_')
    ) {
      console.log('this condition is true');
      batch = 'Automation Novelty Retouch';
    }
  } else if (
    shippingMethod !== null &&
    shippingMethod.includes('Ship to Home') & fmhvStage.includes('1')
  ) {
    console.log('this condition is true');
    batch = 'Main Production';
  } else if (
    shippingMethod !== null &&
    shippingMethod.includes('Post Picture Day Order Fee') &
      fmhvStage.includes('1')
  ) {
    console.log('this condition is true');
    batch = 'To Loroco with Issue';
  } else {
    console.log('none of the criteria was met');
    batch = 'To Loroco';
  }
  return batch;
}

let batchCategory = await setBatchCategory();
console.log(batchCategory);

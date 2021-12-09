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

  // const fmhvSeason = null;
  // const fmhvPaymentMethod = null;
  // const fmhvStage = null;
  // const _fktPackage = null;
  // const imageOption = null;
  // const homeZip = null;
  batch = 'To Loroco';

  // all logic here
  // 1: IF Season LIKE "Senior" THEN set Batch Category to Main Production
  // 2: If Season LIKE "Year" THEN set Batch Category to Main Production
  // 3: IF Payment Method = NULL THEN set Batch Category to Main Production
  // 4: IF homeZip IS NULL THEN set Batch Category to Main Production
  // 5: If fmhvStage CONTAINS 'Wholesale Reorder' Then set Batch Category to To Loroco
  // 6: IF homeZip IS NOT NULL AND IF fmhvStage CONTAINS '1.' THEN set Batch Category to Main Production
  // 7: If fmhvStage CONTAINS 'auto'
  // 7a:  AND IF Ordered Items (_fktPackage) DO NOT CONTAIN: DIST_* AND IF imageOptions DO NOT CONTAIN: AB THEN set Batch Category to Automation
  // 7b: AND IF _fktPackage CONTAIN: DIST_* AND IF imageOptions DO NOT CONTAIN: AB THEN set Batch Category to Automation Novelty
  // 7c: AND IF _fktPackage DO NOT CONTAIN: DIST_* AND IF imageOptions CONTAIN: AB THEN set Batch Category to Automation Retouch
  // 7d: AND IF _fktPackage CONTAIN: DIST_* AND IF imageOptions CONTAIN: AB THEN set Batch Category to Automation Novelty Retouch
  // 11: Else Set to Loroco

  if (
    (fmhvSeason !== null && fmhvSeason.includes('Senior')) ||
    (fmhvSeason !== null && fmhvSeason.includes('Year'))
  ) {
    batch = 'Main Production'; // 1 & 2
  } else if (fmhvPaymentMethod === null) {
    batch = 'Main Production'; // 3
  } else if (homeZip === null) {
    batch = 'Main Production'; // 4
  } else if (homeZip !== null && homeZip.includes('1')) {
    batch = 'Main Production'; // 6
  } else if (
    fmhvStage !== null &&
    fmhvStage.includes('Wholesale Reorder')
  ) {
    batch = 'To Loroco'; // 5
  } else if (fmhvStage !== null && fmhvStage.includes('AUTO')) {
    if (
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

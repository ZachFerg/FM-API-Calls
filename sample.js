// async function setBatchCategory() {
//   const fmhvSeason = null;
//   const fmhvShipCode = "Spec_Reorder";
//   const shippingMethod = "Post Picture Day Order Fee";
//   const fmhvPaymentMethod = "Stripe";
//   const fmhvStage = "CCG_ORDER_FEE";
//   const _fktPackage = null;
//   const postPictureDayArr = [
//     "ORDER_FEE",
//     "CCG_ORDER_FEE",
//     "PPD_$5",
//     "Spec_Reorder",
//   ];
//   const shipToHomeArr = ["SPORT_ORDER", "UC_REORDER", "UC_LATE_ORDER"];
//   let batch = "";
//   if (
//     (fmhvSeason !== null && fmhvSeason.includes("Senior")) ||
//     (fmhvSeason !== null && fmhvSeason.includes("Year"))
//   ) {
//     console.log("this condition is true");
//     batch = "Main Production";
//   } else if (
//     (shippingMethod !== null && shippingMethod.includes("Pay to Keep")) ||
//     (shippingMethod !== null &&
//       shippingMethod.includes("Plan C Processing Fee")) ||
//     (shippingMethod !== null && shippingMethod.includes("Ship to School"))
//   ) {
//     console.log("this condition is true");
//     batch = "Main Production";
//   } else if (shippingMethod === null && fmhvShipCode === null) {
//     if (
//       (_fktPackage !== null && _fktPackage.includes("O-1")) ||
//       (_fktPackage !== null && _fktPackage.includes("OA-1")) ||
//       (_fktPackage !== null && _fktPackage.includes("O-1;BS")) ||
//       (_fktPackage !== null && _fktPackage.includes("OA-1;BS"))
//     ) {
//       console.log("this condition is true");
//       batch = "Main Production";
//     } else if (
//       (_fktPackage !== null && _fktPackage.includes("ENTIRE_PKG_")) ||
//       (_fktPackage !== null && _fktPackage.includes("SPEC_SHEETS"))
//     ) {
//       console.log("this condition is true");
//       batch = "Main Production";
//     }
//   } else if (
//     (fmhvShipCode !== null && fmhvShipCode === "KEEP_NO CHARGE") ||
//     (fmhvShipCode !== null && fmhvShipCode === "PLAN_C_SHIP_HOME") ||
//     (fmhvShipCode !== null && fmhvShipCode === "SHIP_SCHOOL")
//   ) {
//     console.log("this condition is true");
//     batch = "Main Production";
//   } else if (fmhvPaymentMethod === null) {
//     console.log("this condition is true");
//     batch = "Main Production";
//   } else if (fmhvStage !== null && fmhvStage.includes("AUTO")) {
//     if (
//       _fktPackage !== null &&
//       _fktPackage.includes("AB") &&
//       !_fktPackage.includes("DIST_")
//     ) {
//       console.log("this condition is true");
//       batch = "Automation Retouch";
//     } else if (
//       _fktPackage !== null &&
//       !_fktPackage.includes("AB") &&
//       !_fktPackage.includes("DIST_")
//     ) {
//       console.log("this condition is true");
//       batch = "Automation";
//     } else if (
//       _fktPackage !== null &&
//       !_fktPackage.includes("AB") &&
//       _fktPackage.includes("DIST_")
//     ) {
//       console.log("this condition is true");
//       batch = "Automation Novelty";
//     } else if (
//       _fktPackage !== null &&
//       _fktPackage.includes("AB") &&
//       _fktPackage.includes("DIST_")
//     ) {
//       console.log("this condition is true");
//       batch = "Automation Novelty Retouch";
//     }
//   } else if (
//     shippingMethod !== null &&
//     shippingMethod.includes("Ship to Home")
//   ) {
//     if (fmhvStage.includes("1")) {
//       console.log("this condition is true");
//       batch = "Main Production";
//     } else if (!shipToHomeArr.includes(fmhvShipCode)) {
//       console.log("this condition is true");
//       batch = "To Loroco with Issue";
//     }
//   } else if (
//     shippingMethod !== null &&
//     shippingMethod.includes("Post Picture Day Order Fee")
//   ) {
//     if (fmhvStage.includes("1")) {
//       console.log("this condition is true");
//       batch = "To Loroco with Issue";
//     } else if (postPictureDayArr.includes(fmhvShipCode)) {
//       console.log("this condition is true");
//       batch = "To Loroco with Issue";
//     }
//   } else {
//     console.log("none of the criteria was met");
//     batch = "To Loroco";
//   }
//   return batch;
// }

// let batchCategory = await setBatchCategory();
// console.log(batchCategory);

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

test1()
test2()
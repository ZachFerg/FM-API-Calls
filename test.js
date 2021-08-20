// require("@babel/core").transformSync("code", {
//   plugins: ["@babel/plugin-proposal-optional-chaining"],
// });

// if (data && data["order"] && data["order"]["subject"]) {
//   console.log("we have all the objects");
// } else {
//   console.log("we are missing something");
//   if (data["order"]["subject"]) {
//     console.log("we have the order.subject Object");
//   } else {
//     console.log("we do not have the order.subject Object");
//     subject = {
//       subject: {
//         grade: null,
//         firstName: null,
//       },
//     };
//     let merged = { ...data, ...subject };
//     console.log(merged);
//   }
// }

const data = {
  order: {
    id: "01FBG2PXN313G74YSN1KRPMPVY",
    recipientName: "Jennifer Hale",
    recipientEmail: "email1@gmail.com",
    orderFormEntrys: [
      {
        form: {
          title: "please enter your player's information",
          label: "sports",
        },
        values: {
          "FAIWPO2NJ4-E9K-PL1I0Y": "Cayley", // studentFirstName
          "FAIWV436HI-I07-DO5SSQ": "Gibson", // studentLastName
          "FAIWV4374O-PR4-84T6NU": "Pisgah", // Teacher
        },
      },
    ],
  },
};

// // foo === null || foo === void 0 ? void 0 : foo.bar;

const personName = data.order?.subject?.firstName ?? data.order.orderFormEntrys[0].values["FAIWPO2NJ4-E9K-PL1I0Y"];
console.log(personName)

// const foo = null ?? 'default string';
// console.log(foo);

// console.log(data.order.orderFormEntrys[0].values["FAIWPO2NJ4-E9K-PL1I0Y"]);

// const personName = data.order.orderFormEntrys[0].values["FAIWPO2NJ4-E9K-PL1I0Y"]  // works
// const personName = data.order.subject.firstName || 'no name'; // data.order.orderFormEntrys[0].values["FAIWPO2NJ4-E9K-PL1I0Y"]  // works
// console.log(personName)

// let promise = new Promise(function(resolve, reject) {
//   setTimeout(() => resolve("done!"), 1000);
// });

// // resolve runs the first function in .then
// promise.then(
//   result => console.log(result), // shows "done!" after 1 second
//   error => console.log(error) // doesn't run
// );

// const response = {
//   data: {
//     // temperature: {
//     //   current: 68,
//     //   high: 79,
//     //   low: 45
//     // },
//     averageWindSpeed: 8
//   }
// }

// // const highTemperature = response.data.temperature.current;
// const highTemperature = response.data?.temperature?.high;
// console.log(highTemperature);
const request = require("request");

// const json = {
//   name: "Dinesh Chugtai",
//   email: "dinesh@piedpiper.com",
// };

const json = {
  _fknShootNumber: "341122",
  _fktCustomerNo: "113818",
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

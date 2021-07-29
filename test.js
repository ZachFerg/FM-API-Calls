  let data = {
  order: {
    id: "01FBG2PXN313G74YSN1KRPMPVY",
    recipientName: "Jennifer Hale",
    recipientEmail: "email1@gmail.com",
    // subject: {
    //   firstName: "Lillie",
    //   lastName: "Hale",
    //   email: "email@gmail.com",
    //   grade: 6,
    // },
  },
};

if (data && data["order"] && data["order"]["subject"]) {
  console.log("we have all the objects");
} else {
  console.log("we are missing something");
  if (data["order"]["subject"]) {
    console.log("we have the order.subject Object");
  } else {
    console.log("we do not have the order.subject Object");
    subject = {
      subject: {
        grade: null,
        firstName: null,
      },
    };
    let merged = { ...data, ...subject };
    console.log(merged);
  }
}
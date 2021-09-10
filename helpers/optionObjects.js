// added the U in case we get back an undefined value from the response
// will default to a U if the value is null/undefined
const studentRelationship = {
  M: "Mother",
  F: "Father",
  GR: "Grandparent",
  G: "Guardian",
  O: "Other",
  U: "Unknown",
};

const gradeMap = {
  HS: "HS",
  PK: "PK",
  K: "K",
  "1": "01",
  "2": "02",
  "3": "03",
  "4": "04",
  "5": "05",
  "6": "06",
  "7": "07",
  "8": "08",
  "9": "09",
  "01": "01",
  "02": "02",
  "03": "03",
  "04": "04",
  "05": "05",
  "06": "06",
  "07": "07",
  "08": "08",
  "09": "09",
  10: "10",
  11: "11",
  12: "12",
  U: "Unknown",
};

const sportsMap = {
  BS: "Baseball",
  BK: "Basketball",
  CH: "Cheer",
  XC: "Cross Country",
  DC: "Dance",
  FH: "Field Hockey",
  FB: "Football",
  GF: "Golf",
  GM: "Gymnastics",
  KB: "Kickball",
  LC: "LaCrosse",
  MC: "Music",
  RG: "Rugby",
  SR: "Soccer",
  SB: "Softball",
  SM: "Swim",
  TN: "Tennis",
  TK: "Track",
  VB: "Volleyball",
  WR: "Wrestling",
  GC: "Generic",
};

module.exports = { studentRelationship, gradeMap, sportsMap };

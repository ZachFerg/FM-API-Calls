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
    HS: "Head Start",
    PK: "Pre Kindergarten",
    K: "Kindergarten",
    1: "01",
    2: "02",
    3: "03",
    4: "04",
    5: "05",
    6: "06",
    7: "07",
    8: "08",
    9: "09",
    10: "10",
    11: "11",
    12: "12",
    U: "Unknown",
  };


  module.exports = { studentRelationship, gradeMap };
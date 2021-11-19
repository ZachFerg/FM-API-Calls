const {
  studentRelationship,
  gradeMap,
  sportsMap,
} = require('../helpers/optionObjects');

function formatRelationship(string) {
  studString = string;
  if (studString == null) {
    result = null;
  } else {
    result = studString.replace(
      studString,
      (m) => studentRelationship[m],
    );
  }
  return result;
}

function formatGrade(string) {
  gradeString = string;
  if (gradeString == null) {
    result = null;
  } else {
    result = gradeString.replace(gradeString, (m) => gradeMap[m]);
  }
  return result;
}

function formatSport(string) {
  sportString = string;
  if (sportString == null) {
    result = null;
  } else {
    result = sportString.replace(sportString, (m) => sportsMap[m]);
  }
  return result;
}

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

module.exports = {
  formatRelationship,
  formatGrade,
  formatSport,
  formatDate,
};

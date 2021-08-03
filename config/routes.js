const mysqlStrawbridge = require('../routes/mysql_strawbridge');

const routes = (app, ext) => {
  mysqlStrawbridge(app, ext);
};

module.exports = routes;
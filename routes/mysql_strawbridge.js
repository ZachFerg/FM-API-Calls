const express = require('express');
const { addNewOrder, getAll } = require('../controllers/mysql_strawbridge');

const router = express.Router();
router.get('/loroco_test', getAll);
router.post('/loroco_test', addNewOrder);

module.exports = router;

const express = require('express');
const exportController = require('../controller/exportController');
const router = express.Router();

router.get('/export-employes', exportController.exportEmployesToExcel);

module.exports = router;

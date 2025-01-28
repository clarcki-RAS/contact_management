const express = require('express');
const { addRapport, getRapports, deletRapports } = require('../controller/rapportController');
const router = express.Router();

// Route pour ajouter un rapport
router.post('/api/rapports', addRapport);

// Route pour récupérer les rapports
router.get('/api/rapports', getRapports);

// Route pour supprimer un rapport
router.delete('/api/rapports', deletRapports);

module.exports = router;

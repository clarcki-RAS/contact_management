const express = require('express');
const router = express.Router();
const forfaitController = require('../controller/forfaitController');

// Route pour ajouter un forfait avec gestion de l'historique
router.post('/ajouter', forfaitController.ajouterForfait);

module.exports = router;

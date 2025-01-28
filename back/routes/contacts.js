const express = require('express');
const { getContacts,updateLigneStatus,destituerUtilisateur,reactivateLigne } = require('../controller/contactController');

const router = express.Router();

// Route pour récupérer les informations des contacts
router.get('/contacts', getContacts);
router.put('/contacts/:id/resilier', updateLigneStatus);
router.put('/contacts/:id/destituer', destituerUtilisateur);
router.put('/contacts/:id/reactiver', reactivateLigne);

module.exports = router;

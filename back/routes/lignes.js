const express = require('express');
const router = express.Router();
const ligneController = require('../controller/ligneController');
const { calculeLigne } = require('../controller/ligneController');
router.get('/lignes', async (req, res) => {
    try {
        const query = `
            SELECT 
                custcode, 
                numero, 
                msisdn, 
                typeLigne, 
                statut, 
                utilisateurAssigne AS utilisateur, 
                CASE 
                    WHEN etat_assignation = true THEN 'attribué' 
                    ELSE 'non attribué' 
                END AS etat
            FROM Lignes;
        `;
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des lignes :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

// Ajouter une ligne
router.post('/add', ligneController.addLigne);

// Récupérer toutes les lignes
router.get('/', ligneController.getAllLignes);
router.get('/contacts', ligneController.getContacts);
// Route pour récupérer les lignes non assignées
router.get('/unassigned', ligneController.getUnassignedLines);
router.get('/stats', ligneController.getLineStats);
router.get('/calcule-ligne', calculeLigne);
// Récupérer une ligne par son ID
router.get('/:id', ligneController.getLigneById);

// Mettre à jour une ligne
router.put('/:id', ligneController.updateLigne);

// Supprimer une ligne
router.delete('/:id', ligneController.deleteLigne);

// Assigner un utilisateur à une ligne
router.post('/assign-user', ligneController.assignUserToLigne);


// Route pour assigner une ligne
router.patch('/assign/:id_ligne', ligneController.assignLine);

// Route pour calculer les lignes actives et résiliées


module.exports = router;

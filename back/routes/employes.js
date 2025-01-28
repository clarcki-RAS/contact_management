const express = require('express'); 
const router = express.Router();
const employeController = require('../controller/employeController');

// Route pour ajouter un employé
router.post('/add', employeController.addEmploye);
// Route pour assigner une ligne à un employé
router.post('/assign-line', employeController.assignLineToEmployee);

// Route pour obtenir tous les employés
router.get('/', employeController.getAllEmployes);


// Route pour supprimer un employé par son matricule
router.delete('/:matricule', employeController.deleteEmployee);

// Route pour mettre à jour un employé par son matricule
router.put('/:matricule', employeController.updateEmployee);
router.get('/no-lines', employeController.getEmployeesWithNoLines);


module.exports = router;

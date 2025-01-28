const express = require('express');
const jwt = require('jsonwebtoken'); // Correction de l'import
const bcrypt = require('bcrypt'); // Ceci reste inchangé
const { User } = require('../models'); 
const authController = require('../controller/authcontroller');

const router = express.Router();


// Middleware pour authentifier l'utilisateur avec le token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Accès non autorisé.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; // Ajout des informations utilisateur décodées dans la requête
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide.' });
    }
};

// Route pour le login (existant, non modifié)
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Route pour l'enregistrement (existant, non modifié)
router.post('/register', async (req, res) => {
    const { email, name, surname, service, role, location, password, securityKey } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            name,
            surname,
            service,
            role,
            location,
            password: hashedPassword,
            securityKey: role === 'super_admin' ? securityKey : null,
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Nouvelle route pour récupérer les données de l'utilisateur connecté
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.user.email }, // Utilise l'email du token décodé
            attributes: ['name', 'surname', 'service', 'location', 'email'], // Champs retournés
        });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable." });
        }

        res.status(200).json(user); // Retourne les données utilisateur trouvées
    } catch (error) {
        console.error(error); // Ajout d'un log d'erreur
        res.status(500).json({ error: "Erreur serveur." });
    }
});

module.exports = router;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Import du modèle User

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect." });
        }

        // Mettre `etat_connection` à true pour l'utilisateur connecté
        user.etat_connection = true;
        await user.save(); // Sauvegarder l'instance mise à jour

        const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET, // Change this to une valeur sécurisée en production
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Connexion réussie.",
            token,
            user: {
                email: user.email,
                name: user.name,
                surname: user.surname,
                role: user.role,
                service: user.service,
                location: user.location,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

exports.logout = async (req, res) => {
    const { email } = req.body; // Supposons que l'email de l'utilisateur soit envoyé dans le corps de la requête

    try {
        // Trouver l'utilisateur par son email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable." });
        }

        // Mettre `etat_connection` à false
        user.etat_connection = false;
        await user.save();

        res.status(200).json({ message: "Déconnexion réussie." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};
exports.getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Token non fourni" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { email: decoded.email, etat_connection: true } });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable ou non connecté" });
        }

        res.status(200).json({
            name: user.name,
            surname: user.surname,
            role: user.role,
            location: user.location,
            service:user.service,
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.confirmLogout = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        user.etat_connection = false;
        await user.save();

        res.status(200).json({ message: "Utilisateur déconnecté avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

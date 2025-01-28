const express = require('express');
const cors = require('cors');
const sequelize = require('./models');
const authRoutes = require('./routes/auth');
const employesRoutes = require('./routes/employes');
const rapportRoutes = require('./routes/rapport');
const exportationRoutes = require('./routes/exportation');
const ligneRoutes = require('./routes/lignes');
const forfaitRoutes = require('./routes/forfaits');
const contactRoutes = require('./routes/contacts'); // Import des routes des contacts
const cron = require('node-cron');
const { verifierForfaits } = require('./controller/forfaitsController');


const app = express(); // Initialisation de l'application Express
const PORT = 8000;
require('dotenv').config();

// Planification d'une tâche cron
cron.schedule('0 0 * * *', () => {
  console.log('Vérification des forfaits expirés...');
  verifierForfaits();
});

// Middleware CORS
app.use(
  cors({
    origin: ['https://localhost:5173', 'http://localhost:5173'], // Adresse du frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json()); // Middleware pour traiter les requêtes JSON

// Définir les routes
app.use('/api/auth', authRoutes);
app.use('/api/employes', employesRoutes);
app.use('/api/exportation', exportationRoutes);
app.use('/api/lignes', ligneRoutes);
app.use('/api/forfaits', forfaitRoutes);
app.use('/api', contactRoutes); // Ajout des routes des contacts
app.use(rapportRoutes); // Routes des rapports

// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend APMF Contact');
});

// Synchronisation avec la base de données
sequelize.sequelize
  .sync()
  .then(() => {
    console.log('Base de données synchronisée.');

    // Lancer le serveur
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur https://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation avec la base de données:', error);
  });

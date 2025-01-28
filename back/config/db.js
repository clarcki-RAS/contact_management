const { Pool } = require('pg');
const config = require('./config.json');

// Choix de l'environnement (par défaut "development")
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Créer une instance de Pool
const pool = new Pool({
    user: dbConfig.username,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: 5432, // Port par défaut de PostgreSQL
});

module.exports = pool;

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


// Initialisation de Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Chargement des modèles
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Appel des associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Définir les relations supplémentaires
if (db.Lignes && db.Forfait) {
  // Une ligne peut avoir un forfait
  db.Lignes.hasOne(db.Forfait, {
    foreignKey: 'id_ligne',
    as: 'forfait',
    onDelete: 'CASCADE', // Supprime le forfait si la ligne est supprimée
  });

  // Un forfait appartient à une ligne
  db.Forfait.belongsTo(db.Lignes, {
    foreignKey: 'id_ligne',
    as: 'ligne',
  });
}

// Ajout de sequelize et Sequelize à l'objet db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

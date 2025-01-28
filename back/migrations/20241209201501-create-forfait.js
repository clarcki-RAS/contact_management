'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Forfaits', {
      id_forfait: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nom_forfait: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prix: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      validite: {
        type: Sequelize.INTEGER, // Validité en jours
        allowNull: false,
      },
      date_debut: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      id_ligne: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Lignes', // Nom de la table Lignes
          key: 'id_ligne', // Clé primaire de Lignes
        },
        onDelete: 'CASCADE', // Supprime les forfaits si la ligne est supprimée
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Forfaits');
  },
};

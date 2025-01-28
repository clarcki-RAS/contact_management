'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HistoriqueForfaits', {
      id_historique: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_ligne: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Lignes', // Nom de la table Lignes
          key: 'id_ligne', // Clé primaire de Lignes
        },
        onDelete: 'CASCADE', // Supprime l'historique si la ligne est supprimée
      },
      id_forfait: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Forfaits', // Nom de la table Forfaits
          key: 'id_forfait', // Clé primaire de Forfaits
        },
        onDelete: 'CASCADE', // Supprime l'historique si le forfait est supprimé
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
    await queryInterface.dropTable('HistoriqueForfaits');
  },
};

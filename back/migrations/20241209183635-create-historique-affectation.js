'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HistoriqueAffectations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      affectation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateAffectation: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      matricule: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Employes', // Nom de la table Employe
          key: 'matricule', // Clé primaire de la table Employe
        },
        onDelete: 'CASCADE', // Supprime les historiques si l'employé est supprimé
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('HistoriqueAffectations');
  },
};

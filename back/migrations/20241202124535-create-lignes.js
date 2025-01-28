'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Lignes', {
      id_ligne: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      custcode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      msisdn: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      typeLigne: {
        type: Sequelize.ENUM('postpaid', 'control'),
        allowNull: false,
      },
      statut: {
        type: Sequelize.ENUM('active', 'suspendue', 'resilie', 'en attente'),
        allowNull: false,
      },
      utilisateurAssigne: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Lignes');
  },
};

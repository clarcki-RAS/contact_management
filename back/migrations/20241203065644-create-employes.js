module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employes', {
      matricule: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      siege: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      localiteTravail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fonction: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      classification: {
        type: Sequelize.STRING,
      },
      affectationPrecedente: {
        type: Sequelize.STRING,
      },
      dateEmbauche: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      contactPersonnel: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_ligne: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Lignes', // Nom de la table des lignes
          key: 'id_ligne', // Clé primaire correcte
        },
        onDelete: 'CASCADE', // Ou 'SET NULL', 
        allowNull: true,
      },
      
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Employes');
  },
};

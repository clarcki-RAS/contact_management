module.exports = (sequelize, DataTypes) => {
  const Employe = sequelize.define('Employe', {
    matricule: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    siege: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    localiteTravail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fonction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    affectationPrecedente: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateEmbauche: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contactPersonnel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Employe.associate = (models) => {
    Employe.belongsTo(models.Lignes, {
      foreignKey: 'id_ligne',
      onDelete: 'CASCADE',
    });
  };

  return Employe;
};

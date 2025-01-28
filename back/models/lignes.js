'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Ligne extends Model {
    static associate(models) {
      // Association avec Forfait avec un alias unique
      Ligne.hasOne(models.Forfait, {
        foreignKey: 'id_ligne',
        as: 'ligneForfait', // Utilisation d'un alias unique pour cette association
      });
    }
  }

  Ligne.init(
    {
      id_ligne: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      custcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numero: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      msisdn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      typeLigne: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      statut: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      utilisateurAssigne: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      etat_assignation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Lignes',
      tableName: 'Lignes',
      timestamps: true,
    }
  );

  return Ligne;
};

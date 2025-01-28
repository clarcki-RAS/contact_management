'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Forfait extends Model {
    static associate(models) {
      // Association avec la table Lignes avec un alias unique
      Forfait.belongsTo(models.Lignes, {
        foreignKey: 'id_ligne',
        onDelete: 'CASCADE',
        as: 'ligneForfait', // Alias unique pour éviter les conflits
      });
    }
  }

  Forfait.init(
    {
      id_forfait: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nom_forfait: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      validite: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date_debut: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_ligne: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Lignes',
          key: 'id_ligne',
        },
      },
    },
    {
      sequelize,
      modelName: 'Forfait',
      tableName: 'Forfaits',
      timestamps: true,
    }
  );

  return Forfait;
};

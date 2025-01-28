'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class HistoriqueForfait extends Model {
    static associate(models) {
      // Association avec Lignes
      HistoriqueForfait.belongsTo(models.Lignes, {
        foreignKey: 'id_ligne',
        onDelete: 'CASCADE', // Supprime l'historique si la ligne est supprimée
      });

      // Association avec Forfait
      HistoriqueForfait.belongsTo(models.Forfait, {
        foreignKey: 'id_forfait',
        onDelete: 'CASCADE', // Supprime l'historique si le forfait est supprimé
      });
    }
  }
  HistoriqueForfait.init(
    {
      id_historique: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_ligne: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Lignes', // Référence à la table Lignes
          key: 'id_ligne',
        },
      },
      prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      validite: {
        type: DataTypes.INTEGER, // Validité en jours, par exemple
        allowNull: false,
      },
      date_debut: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_forfait: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Forfait', // Référence à la table Forfait
          key: 'id_forfait',
        },
      },
    },
    {
      sequelize,
      modelName: 'HistoriqueForfait',
    }
  );
  return HistoriqueForfait;
};

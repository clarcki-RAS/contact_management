'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class HistoriqueAffectation extends Model {
    static associate(models) {
      // Association avec Employe
      HistoriqueAffectation.belongsTo(models.Employe, {
        foreignKey: 'employeId',
        onDelete: 'CASCADE', // Supprime l'historique si l'employé est supprimé
        onUpdate: 'CASCADE',
      });
    }
  }

  HistoriqueAffectation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      affectation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateAffectation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'HistoriqueAffectation',
    }
  );

  return HistoriqueAffectation;
};

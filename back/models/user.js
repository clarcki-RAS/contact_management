'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Ajouter des associations ici si nécessaire
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Clé primaire
        unique: true,     // Garantir l'unicité
        validate: {
          isEmail: true,  // Validation du format email
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['admin', 'super_admin', 'simple_user']], // Validation des rôles
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      etat_connection: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Par défaut : pas connecté
      },
      securityKey: {
        type: DataTypes.STRING,
        allowNull: true, // Optionnel
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: async (user) => {
          // Vérification de la clé de sécurité pour "super_admin"
          if (user.role === 'super_admin' && !user.securityKey) {
            throw new Error('La clé de sécurité est requise pour le rôle Super Admin.');
          }
        },
      },
    }
  );
  return User;
};

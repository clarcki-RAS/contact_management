
module.exports = (sequelize, DataTypes) => {
    const Rapport = sequelize.define('Rapport', {
      id_rapport: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      date_redaction: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      contenue: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      tableName: 'rapports',
      timestamps: false, // Désactive createdAt et updatedAt
    });
  
    return Rapport;
  };
  
const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      //unique: true,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    healthScore:{
      type: DataTypes.FLOAT,
      validate: {
        max: 100,
    }},
    image: {
      type: DataTypes.STRING
    },
    steps: {
      type: DataTypes.TEXT
    },
  },
  {timestamps: false});
};

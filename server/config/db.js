const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); 
  } catch (error) {
    console.error('❌ Neon Connection Error:', error);
  }
};

module.exports = { sequelize, connectDB };
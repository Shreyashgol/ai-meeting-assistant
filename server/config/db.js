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
    console.log('✅ Neon PostgreSQL Connected Successfully');
    await sequelize.sync(); 
    console.log('✅ Tables Synced');
  } catch (error) {
    console.error('❌ Neon Connection Error:', error);
  }
};

module.exports = { sequelize, connectDB };
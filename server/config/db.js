const { Sequelize } = require('sequelize');
const pg = require('pg'); 
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
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
    console.log('✅ Database Connected Successfully');
    await sequelize.sync(); 
    console.log('✅ Tables Synced');
  } catch (error) {
    console.error('❌ Connection Error:', error);
  }
};

module.exports = { sequelize, connectDB };
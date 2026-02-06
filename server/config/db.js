const { Sequelize } = require('sequelize');
const pg = require('pg'); // 👈 IMP: Manually import kiya
require('dotenv').config();

// SSL check for Production vs Local
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg, // 👈 IMP: Vercel ko bataya ki driver ye hai
  logging: false,
  dialectOptions: {
    ssl: {
      require: true, // Neon DB needs SSL
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
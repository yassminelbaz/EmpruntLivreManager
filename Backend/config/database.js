const Sequelize = require('sequelize');
require('dotenv').config();

const database = new Sequelize (
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
  host: process.env.DB_HOST,
  dialect:'mysql',
});

//create a conexion function 
const connection = async ()=>{
  //autheniticate means run our connection
  try{
  await database.authenticate();
  console.log('Connexion established succesfuly');  
      }
      catch (err) {
        console.error('Unable to connect to database', err.message);
}

      };

//connection methode: 
      connection();
      module.exports = database;
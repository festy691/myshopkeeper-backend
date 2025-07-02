const tedious = require("tedious");
const {
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  DB_PORT,
  CA_CERT
} = require("./env_config");

const { Sequelize } = require('sequelize');

const connectDb = async (): Promise<any> => {
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        dialect: DB_DIALECT,
        logging: false, // (e) => console.log(e),
        port: DB_PORT,
        host: DB_HOST,
        dialectOptions: {
            ssl: {
                require: true, // Enable SSL
                rejectUnauthorized: false, // Disable self-signed SSL certificates (only in non-production environments)
                ca: CA_CERT
            }
        }
        // dialectModule: tedious,
    });

    // Test the database connection
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }

    return sequelize;
};

export default connectDb;
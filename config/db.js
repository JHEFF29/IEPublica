const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false, // Cambiar a true si usas Azure o SSL
        trustServerCertificate: true
    }
};

async function connectToDatabase() {
    try {
        let pool = await sql.connect(config);
        console.log('Conectado a la base de datos');
        return pool;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
    }
}

module.exports = { connectToDatabase, sql };

const express = require('express');
const cors = require('cors');
const sequelize = require('./sequelize');

const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors policy
app.use(cors());


// connexion à la BDD 
async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();
}

init();


// Différentes routes



module.exports = app;
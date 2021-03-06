const express = require('express');
const cors = require('cors');
const sequelize = require('./sequelize');

//import routes
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const userRoutes = require('./routes/user');
const fileRoutes = require('./routes/file');
const notificationRoutes = require('./routes/notification');
const logRoutes = require('./routes/log');

const app = express();

// body-parser
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

//init authentication to database
async function init() {
	await assertDatabaseConnectionOk();
}

init();


//------------- Différentes routes -------------//

// authentication
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);

// main
app.use('/api/user', userRoutes);
app.use('/api/file', fileRoutes);

// secondary
app.use('/api/notification', notificationRoutes);
app.use('/api/log', logRoutes);
// app.use('/api/userNotification', userNotificationRoutes);


module.exports = app;
const { Sequelize, DataTypes } = require('sequelize');
const { linkModels } = require('./link');

const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      useUTC: false,
    },
    timezone: '+05:30',
});

// exports all models files
const modelDefiners = [
	require('./models/user.model'),
	require('./models/file.model'),
	require('./models/token.model'),
  require('./models/notification.model'),
  require('./models/log.model'),
];

// define sequelize models
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize, DataTypes);
}

// We execute links between models, such as adding associations.
linkModels(sequelize);

// create db
sequelize.sync();

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
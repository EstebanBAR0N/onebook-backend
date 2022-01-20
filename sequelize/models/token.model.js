module.exports = (sequelize, DataTypes) => {
	sequelize.define('token', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		token: {
			allowNull: false,
			type: DataTypes.STRING
		},
		creationDate: {
			allowNull: false,
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		expirationDate: {
			allowNull: false,
			type: DataTypes.DATE
		}
	}, {
		freezeTableName: true
	});
};
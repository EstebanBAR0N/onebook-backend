module.exports = (sequelize, DataTypes) => {
	sequelize.define('notification', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true
		},
		message: {
			type: DataTypes.STRING
		}
	}, {
		freezeTableName: true
	});
};
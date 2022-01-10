module.exports = (sequelize, DataTypes) => {
	sequelize.define('log', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        message: {
            allowNull: false,
			type: DataTypes.STRING
        }
	});
};
module.exports = (sequelize, DataTypes) => {
	sequelize.define('file', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		url: {
			allowNull: false,
			type: DataTypes.STRING,
		},
        format: {
			type: DataTypes.STRING,
            validate: {
                isIn: [['IMAGE', 'VIDEO', 'AUDIO']],
            }
        },
        onHold: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
        }
	}, {
		freezeTableName: true
	});
};
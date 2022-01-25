module.exports = (sequelize, DataTypes) => {
	sequelize.define('user', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		username: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true,
			validate: {
				is: /^\w{3,}$/
			}
		},
		email: {
      allowNull: false,
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isEmail: {
				  msg: "Must be a valid email address",
				}
			}
		},
		password: {
      allowNull: false,
			type: DataTypes.STRING
		},
		profilImage: {
			type: DataTypes.STRING(2048),
			defaultValue: null
		},
		birthDate: {
			type: DataTypes.DATE,
			defaultValue: null
		},
		admin: {
      type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	}, {
    freezeTableName: true
  });
};
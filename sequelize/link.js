function linkModels(sequelize) {
	const { user, file, token, notification, log } = sequelize.models;

    // création les liaisons

    // Posseder
	user.hasMany(file);
	file.belongsTo(user);
    
    // Identifier
    user.hasMany(token);
    token.belongsTo(user);

    // Notifier
	notification.belongsToMany(user, {through: 'user-notification'});
    
    // Créer
    user.hasMany(log);
    log.belongsTo(user);
}

module.exports = { linkModels };
// Une fonction qui permet de s'assurer que l'ID param de la requête est valide
// et la convertit en entier (car elle est de type string par défaut)
exports.getIdParam = (req) => {
	const id = req.params.id;
	if (/^\d+$/.test(id)) {
		return Number.parseInt(id, 10);
	}
	throw new TypeError(`Invalid ':id' param: "${id}"`);
}

// Une fonction qui permet d'extraire les paramètres de l'url
// ex : /api/user?limit=20&offset=10 => { limit:20, offset:10 } 
exports.getParams = (req) => {

	// récupère tous les paramètres après ?
	const params = req.query;

	// récupère seulement les paramètres supportés : limit, offset, username
	let limit = params['limit'] || null;
	let offset = params['offset'] || null;
	let username = params['username'] || null;

	// vérifie les données passées
	if (limit) {
		if (!isNaN(limit)) {
			limit = Number.parseInt(limit, 10);
		}
		else {
			limit = -1;
		}
	}

	if (offset) {
		if (!isNaN(offset)) {
			offset = Number.parseInt(offset, 10);
		}
		else {
			offset = -1;
		}
	}

	if (username && !isNaN(username)) {
		username = -1;
	}

	const supportedParams = { limit, offset, username };

	return supportedParams;
}

exports.corruptedArg = (supportedParams) => {
	for (arg in supportedParams) {
		if (supportedParams[arg] === -1) {
			return true;
		}
	}
	return false;
}

// retourne le nombre d'argument passé (supportedParams not null)
exports.getNbOfValidArg = (supportedParams) => {
	console.log(supportedParams);
	let nb = 0;
	for (arg in supportedParams) {
		if (supportedParams[arg] !== null) {
			nb += 1;
		}
	}
	
	return nb;
}	

// retourne Vrai si arg n'est pas null et qu'il est de type string
exports.isValidString = (arg) => {
	if (!arg || (typeof(arg) !== 'string')) {
			return false;
	}    
	return true;
}

// retourne Vrai si email est une adresse email valide
exports.isValidEmail = (email) => {
	if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
		return true;
	}
	return false;
}
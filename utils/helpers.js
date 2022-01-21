// Une fonction qui permet de s'assurer que l'ID param de la requête est valide
// et la convertit en entier (car elle est de type string par défaut)
exports.getIdParam = (req) => {
	const id = req.params.id;
	if (/^\d+$/.test(id)) {
		return Number.parseInt(id, 10);
	}
	throw new TypeError(`Invalid ':id' param: "${id}"`);
};


// Une fonction qui permet d'extraire les paramètres de l'url (pour un user)
// ex : /api/user?limit=20&offset=10 => { limit:20, offset:10 } 
exports.getUserParams = (req) => {

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
};


// Une fonction qui permet d'extraire les paramètres de l'url (pour un fichier)
// ex : /api/file?limit=20&offset=10&userId=1 => { limit:20, offset:10, userId:1 } 
exports.getFileParams = (req) => {

	// récupère tous les paramètres après ?
	const params = req.query;

	// récupère seulement les paramètres supportés : limit, offset, userId, format (image, video, audio)
	let limit = params['limit'] || null;
	let offset = params['offset'] || null;
	let userId = params['userId'] || null;
	let format = params['format'] || null;

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

	if (userId) {
		if (!isNaN(userId)) {
			userId = Number.parseInt(userId, 10);
		}
		else {
			userId = -1;
		}
	}

	if (
		format && 
		!exports.isValidFormat(format)
	) {
		format = -1;
	}

	const supportedParams = { limit, offset, userId, format };

	return supportedParams;
};


// check si il n'y a pas d'argument à -1 (corrompu)
exports.corruptedArg = (supportedParams) => {
	for (arg in supportedParams) {
		if (supportedParams[arg] === -1) {
			return true;
		}
	}
	return false;
};


// retourne Vrai si arg n'est pas null et qu'il est de type string
exports.isValidString = (arg) => {
	if (!arg || (typeof(arg) !== 'string')) {
			return false;
	}    
	return true;
};


// retourne Vrai si email est une adresse email valide
exports.isValidEmail = (email) => {
	if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
		return true;
	}
	return false;
};


// retourne Vrai si l'url est valide
exports.isValidUrl = (url) => {
	if (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(url)) {
		return true;
	}
	return false;
};


// retourne Vrai si le format est correct
exports.isValidFormat = (format) => {
	if (format !== 'image' && format !== 'video' && format !== 'audio') {
		return false;
	}
	return true;
};
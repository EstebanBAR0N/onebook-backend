// Une fonction qui permet de s'assurer que l'ID param de la requête est valide
// et la convertit en entier (car elle est de type string par défaut)
function getIdParam(req) {
	const id = req.params.id;
	if (/^\d+$/.test(id)) {
		return Number.parseInt(id, 10);
	}
	throw new TypeError(`Invalid ':id' param: "${id}"`);
}

module.exports = { getIdParam };
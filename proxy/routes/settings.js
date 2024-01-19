const config = require('../config');

module.exports = () => {
	return [
		{
			method: 'GET',
			name: 'settings',
			path: '/api/settings',
			middleware: (req, res, next) => res.send(config)
		}
	];
};

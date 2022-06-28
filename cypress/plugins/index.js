require('dotenv').config();

module.exports = (on, config) => {
	config.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL;
	config.env.CYPRESS_WS_URL =
		process.env.CYPRESS_WS_URL || process.env.REACT_APP_API_URL;
	config.env.REACT_APP_UI_URL = process.env.REACT_APP_UI_URL;
	return config;
};

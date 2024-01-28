module.exports = {
	proxyPath: '/p',
	translation: {
		weblate: {
			host: process.env.FRONTEND_WEBLATE_HOST || null,
			path: process.env.FRONTEND_WEBLATE_PATH || null,
			project: process.env.FRONTEND_WEBLATE_PROJECT || 'frontend',
			apiKey: process.env.FRONTEND_WEBLATE_API_KEY || null,
			percentage: process.env.FRONTEND_WEBLATE_MIN_PERCENT || 50
		},
		cache: {
			disabled: process.env.FRONTEND_TRANSLATION_CACHE_DISABLED || true,
			time: process.env.FRONTEND_TRANSLATION_CACHE_TIME || 30
		}
	},
	registration: {
		directlink: {
			fallbackLoader: {
				enabled: !!parseInt(
					process.env
						.FRONTEND_REGISTRATION_DIRECTLINK_FALLBACKLOADER_ENABLED ||
						'1'
				)
			}
		}
	}
};

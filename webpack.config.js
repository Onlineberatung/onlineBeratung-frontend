var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Registrierung Suchtberatung',
			templateParameters: {
				consultingType: 0
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.suchtberatung-test.html'
		}),
		new HtmlWebpackPlugin({
			title:
				'Registrierung Beratung für Suizidgefährdete junge Menschen [U25]',
			templateParameters: {
				consultingType: 1
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.u25-test.html'
		}),
		new HtmlWebpackPlugin({
			title:
				'Registrierung gemeinsamstatteinsam - Onlineberatung für junge Menschen in besonderen Zeiten',
			templateParameters: {
				consultingType: 1
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.gemeinsamstatteinsam-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Schwangerschaftsberatung',
			templateParameters: {
				consultingType: 2
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.schwangerschaftsberatung-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Beratung für Eltern und Familien',
			templateParameters: {
				consultingType: 3
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.eltern-familie-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Kurberatung für Mütter und Väter',
			templateParameters: {
				consultingType: 4
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.kurberatung-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Beratung zum Thema Schulden',
			templateParameters: {
				consultingType: 5
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.schuldnerberatung-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Allgemeine Sozialberatung',
			templateParameters: {
				consultingType: 6
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.allgemeine-soziale-beratung-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Leben im Alter',
			templateParameters: {
				consultingType: 7
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.leben-im-alter-test.html'
		}),
		new HtmlWebpackPlugin({
			title:
				'Registrierung Leben mit Behinderung und psychischer Erkrankung',
			templateParameters: {
				consultingType: 8
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename:
				'./registration.behinderung-und-psychische-erkrankung-test.html'
		}),
		new HtmlWebpackPlugin({
			title:
				'Registrierung Mein PlanB - Beratung zwischen Schule und Beruf',
			templateParameters: {
				consultingType: 9
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.mein-planb-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Rechtliche Betreuung und Vorsorge',
			templateParameters: {
				consultingType: 10
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.rechtliche-betreuung-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Beratung für Angehörige von Straffälligen',
			templateParameters: {
				consultingType: 11
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.straffaelligkeit-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung HIV/AIDS Beratung',
			templateParameters: {
				consultingType: 12
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.hiv-aids-beratung-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Kinder- und Jugend-Rehabilitation',
			templateParameters: {
				consultingType: 13
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.kinder-reha-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Beratung für Kinder und Jugendliche',
			templateParameters: {
				consultingType: 14
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.kinder-jugendliche-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Sucht-Selbsthilfe - Kreuzbund-Chat',
			templateParameters: {
				consultingType: 15
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.kb-sucht-selbsthilfe-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Migrationsberatung',
			templateParameters: {
				consultingType: 16
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.migration-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Aus-/Rück- & Weiterwanderung',
			templateParameters: {
				consultingType: 17
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.rw-auswanderung-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Hospiz-, Palliativ- und Trauerberatung',
			templateParameters: {
				consultingType: 18
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.hospiz-palliativ-test.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Registrierung Regionale Angebote',
			templateParameters: {
				consultingType: 19
			},
			template: './src/pages/registration.html',
			chunks: [
				'resources/components/registrationFormular/ts/initRegistration'
			],
			filename: './registration.regionale-angebote-test.html'
		})
	]
};

export default {
	addiction: {
		consultingType: '0',
		useInformal: false,
		overline: 'Suchtberatung',
		showEmail: true,
		showPostCode: true,
		voluntaryComponents: [
			{
				componentType: 'SelectDropdown',
				headline: 'Alter',
				handleDropdownSelect: (e) => console.log(e),
				item: {
					id: 'test-id',
					selectedOptions: [
						{
							value: '0-17',
							label: '0-17'
						},
						{
							value: '18-20',
							label: '18-20'
						},
						{
							value: '21-30',
							label: '21-30'
						},
						{
							value: '31-40',
							label: '31-40'
						},
						{
							value: '41-59',
							label: '41-59'
						},
						{
							value: '60+',
							label: '60+'
						}
					],
					selectInputLabel: 'Alter auswählen',
					useIconOption: false,
					isSearchable: false,
					menuPlacement: 'bottom'
				}
			}
		]
	},
	u25: {
		consultingType: '1',
		useInformal: true,
		overline: 'Beratung für Suizidgefährdete junge Menschen [U25]',
		showEmail: false,
		showPostCode: false,
		requiredComponents: [
			{
				componentType: 'dropdown',
				headline: 'Alter',
				selectWrapperId: 'ageSelect__wrapper',
				selectId: 'ageSelect',
				selectName: 'age',
				options: [
					{
						id: 'age0',
						value: null,
						label: 'Alter auswählen*'
					},
					{
						id: 'age1',
						value: '0',
						label: 'unter 12'
					},
					{
						id: 'age2',
						value: '1',
						label: '12'
					}
				]
			},
			{
				componentType: 'dropdown',
				headline: 'Geschlecht',
				selectWrapperId: 'stateSelect__wrapper',
				selectId: 'stateSelect',
				selectName: 'state',
				options: [
					{
						id: 'stateDefault',
						value: null,
						label: 'Bundesland auswählen*'
					},
					{
						id: 'state1',
						value: '1',
						label: 'Baden-Württemberg'
					},
					{
						id: 'state2',
						value: '2',
						label: 'Bayern'
					}
				]
			}
		],
		voluntaryComponents: [
			{
				componentType: 'radiobuttoncoll',
				headline: 'Gender',
				radioButtons: [
					{
						id: 'female',
						name: 'gender',
						value: '0',
						label: 'Weiblich'
					},
					{
						id: 'male',
						name: 'gender',
						value: '1',
						label: 'Männlich'
					},
					{
						id: 'diverseGender',
						name: 'gender',
						value: '2',
						label: 'Divers'
					}
				]
			}
		]
	},
	gemeinsamstatteinsam: {
		consultingType: '1',
		useInformal: true,
		overline:
			'#gemeinsamstatteinsam - Onlineberatung für junge Menschen in besonderen Zeiten',
		showEmail: false,
		showPostCode: false
	},
	pregnancy: {
		consultingType: '2',
		useInformal: true,
		overline: 'Schwangerschaftsberatung',
		showEmail: true,
		showPostCode: true
	},
	parenting: {
		consultingType: '3',
		useInformal: false,
		overline: 'Beratung für Eltern und Familien',
		showEmail: true,
		showPostCode: true
	},
	cure: {
		consultingType: '4',
		useInformal: false,
		overline: 'Kurberatung für Mütter und Väter',
		showEmail: true,
		showPostCode: true
	},
	debt: {
		consultingType: '5',
		useInformal: false,
		overline: 'Beratung zum Thema Schulden',
		showEmail: true,
		showPostCode: true
	},
	social: {
		consultingType: '6',
		useInformal: false,
		overline: 'Allgemeine Sozialberatung',
		showEmail: true,
		showPostCode: true
	},
	seniority: {
		consultingType: '7',
		useInformal: false,
		overline: 'Leben im Alter',
		showEmail: true,
		showPostCode: true
	},
	disability: {
		consultingType: '8',
		useInformal: false,
		overline: 'Leben mit Behinderung und psychischer Erkrankung',
		showEmail: true,
		showPostCode: true
	},
	planB: {
		consultingType: '9',
		useInformal: true,
		overline: 'Mein PlanB: Beratung zwischen Schule und Beruf',
		showEmail: true,
		showPostCode: true
	},
	law: {
		consultingType: '10',
		useInformal: false,
		overline: 'Rechtliche Betreuung und Vorsorge',
		showEmail: true,
		showPostCode: true
	},
	offender: {
		consultingType: '11',
		useInformal: false,
		overline: 'Beratung für Angehörige von Straffälligen',
		showEmail: true,
		showPostCode: false
	},
	aids: {
		consultingType: '12',
		useInformal: false,
		overline: 'HIV/AIDS Beratung',
		showEmail: true,
		showPostCode: true
	},
	rehabilitation: {
		consultingType: '13',
		useInformal: false,
		overline: 'Kinder- und Jugend-Rehabilitation',
		showEmail: true,
		showPostCode: false
	},
	children: {
		consultingType: '14',
		useInformal: true,
		overline: 'Beratung für Kinder und Jugendliche',
		showEmail: true,
		showPostCode: true
	},
	kreuzbund: {
		consultingType: '15',
		useInformal: false,
		overline: 'Sucht-Selbsthilfe - Kreuzbund-Chat',
		showEmail: true,
		showPostCode: false
	},
	migration: {
		consultingType: '16',
		useInformal: false,
		overline: 'Migrationsberatung',
		showEmail: true,
		showPostCode: true
	},
	emigration: {
		consultingType: '17',
		useInformal: false,
		overline: 'Aus-/Rück- & Weiterwanderung',
		showEmail: true,
		showPostCode: true
	},
	hospice: {
		consultingType: '18',
		useInformal: false,
		overline: 'Hospiz-, Palliativ- und Trauerberatung',
		showEmail: true,
		showPostCode: true
	},
	regional: {
		consultingType: '19',
		useInformal: false,
		overline: 'Regionale Angebote',
		showEmail: true,
		showPostCode: true
	}
};

const registrationData = {
	addiction: {
		consultingType: '0',
		useInformal: false,
		overline: 'Suchtberatung',
		showEmail: true,
		showPostCode: true,
		voluntaryComponents: [
			{
				componentType: 'RadioButton',
				headline: 'Hintergrund',
				name: 'relation',
				radioButtons: [
					{
						inputId: 'affected',
						label: 'Betroffen',
						checked: false
					},
					{
						inputId: 'relative',
						label: 'Angehörig',
						checked: false
					},
					{
						inputId: 'otherType',
						label: 'Anderes',
						checked: false
					}
				]
			},
			{
				componentType: 'TagSelect',
				headline: 'Suchtmittel',
				name: 'addictiveDrugs',
				tagSelects: [
					{
						id: 'alcohol',
						label: 'Alkohol'
					},
					{
						id: 'drugs',
						label: 'Drogen'
					},
					{
						id: 'legalHighs',
						label: 'Legal Highs'
					},
					{
						id: 'tabacco',
						label: 'Tabak'
					},
					{
						id: 'medication',
						label: 'Medikamente'
					},
					{
						id: 'gambling',
						label: 'Glücksspiel'
					},
					{
						id: 'internetUse',
						label: 'Internet/Computer'
					},
					{
						id: 'eatingDisorder',
						label: 'Essstörung'
					},
					{
						id: 'otherDrug',
						label: 'Andere'
					}
				]
			},
			{
				componentType: 'SelectDropdown',
				headline: 'Alter',
				name: 'age',
				item: {
					id: 'ageSelect',
					selectedOptions: [
						{
							value: '0',
							label: '0-17'
						},
						{
							value: '1',
							label: '18-20'
						},
						{
							value: '2',
							label: '21-30'
						},
						{
							value: '3',
							label: '31-40'
						},
						{
							value: '4',
							label: '41-59'
						},
						{
							value: '5',
							label: '60+'
						}
					],
					selectInputLabel: 'Alter auswählen',
					useIconOption: false,
					isSearchable: false,
					menuPlacement: 'bottom'
				}
			},
			{
				componentType: 'RadioButton',
				headline: 'Geschlecht',
				name: 'gender',
				radioButtons: [
					{
						inputId: 'female',
						label: 'Weiblich',
						checked: false
					},
					{
						inputId: 'male',
						label: 'Männlich',
						checked: false
					},
					{
						inputId: 'diverseGender',
						label: 'Divers',
						checked: false
					}
				]
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
				componentType: 'SelectDropdown',
				headline: '',
				name: 'age',
				item: {
					id: 'ageSelect',
					selectedOptions: [
						{
							value: '0',
							label: 'unter 12'
						},
						{
							value: '1',
							label: '12'
						},
						{
							value: '2',
							label: '13'
						},
						{
							value: '3',
							label: '14'
						},
						{
							value: '4',
							label: '15'
						},
						{
							value: '5',
							label: '16'
						},
						{
							value: '6',
							label: '17'
						},
						{
							value: '7',
							label: '18'
						},
						{
							value: '8',
							label: '19'
						},
						{
							value: '9',
							label: '20'
						},
						{
							value: '10',
							label: '21'
						},
						{
							value: '11',
							label: '22'
						},
						{
							value: '12',
							label: '23'
						},
						{
							value: '13',
							label: '24'
						},
						{
							value: '14',
							label: '25'
						},
						{
							value: '15',
							label: 'über 25'
						}
					],
					selectInputLabel: 'Alter auswählen*',
					useIconOption: false,
					isSearchable: false,
					menuPlacement: 'bottom'
				}
			},
			{
				componentType: 'SelectDropdown',
				headline: '',
				name: 'state',
				item: {
					id: 'stateSelect',
					selectedOptions: [
						{
							value: '1',
							label: 'Baden-Württemberg'
						},
						{
							value: '2',
							label: 'Bayern'
						},
						{
							value: '3',
							label: 'Berlin'
						},
						{
							value: '4',
							label: 'Brandenburg'
						},
						{
							value: '5',
							label: 'Bremen'
						},
						{
							value: '6',
							label: 'Hamburg'
						},
						{
							value: '7',
							label: 'Hessen'
						},
						{
							value: '8',
							label: 'Mecklenburg-Vorpommern'
						},
						{
							value: '9',
							label: 'Niedersachsen'
						},
						{
							value: '10',
							label: 'Nordrhein-Westfalen'
						},
						{
							value: '11',
							label: 'Rheinland-Pfalz'
						},
						{
							value: '12',
							label: 'Saarland'
						},
						{
							value: '13',
							label: 'Sachsen'
						},
						{
							value: '14',
							label: 'Sachsen-Anhalt'
						},
						{
							value: '15',
							label: 'Schleswig-Holstein'
						},
						{
							value: '16',
							label: 'Thüringen'
						},
						{
							value: '0',
							label: 'außerhalb Deutschlands'
						}
					],
					selectInputLabel: 'Bundesland auswählen*',
					useIconOption: false,
					isSearchable: false,
					menuPlacement: 'bottom'
				}
			}
		],
		voluntaryComponents: [
			{
				componentType: 'RadioButton',
				headline: 'Geschlecht',
				name: 'gender',
				radioButtons: [
					{
						inputId: 'female',
						label: 'Weiblich',
						checked: false
					},
					{
						inputId: 'male',
						label: 'Männlich',
						checked: false
					},
					{
						inputId: 'diverseGender',
						label: 'Divers',
						checked: false
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
		showPostCode: false,
		requiredComponents: [
			{
				componentType: 'SelectDropdown',
				headline: '',
				name: 'age',
				item: {
					id: 'ageSelect',
					selectedOptions: [
						{
							value: '50',
							label: '20'
						},
						{
							value: '51',
							label: '21'
						},
						{
							value: '52',
							label: '22'
						},
						{
							value: '53',
							label: '23'
						},
						{
							value: '54',
							label: '24'
						},
						{
							value: '55',
							label: '25'
						},
						{
							value: '56',
							label: '26'
						}
					],
					selectInputLabel: 'Alter auswählen*',
					useIconOption: false,
					isSearchable: false,
					menuPlacement: 'bottom'
				}
			},
			{
				componentType: 'SelectDropdown',
				headline: '',
				name: 'state',
				item: {
					id: 'stateSelect',
					selectedOptions: [
						{
							value: '1',
							label: 'Baden-Württemberg'
						},
						{
							value: '2',
							label: 'Bayern'
						},
						{
							value: '3',
							label: 'Berlin'
						},
						{
							value: '4',
							label: 'Brandenburg'
						},
						{
							value: '5',
							label: 'Bremen'
						},
						{
							value: '6',
							label: 'Hamburg'
						},
						{
							value: '7',
							label: 'Hessen'
						},
						{
							value: '8',
							label: 'Mecklenburg-Vorpommern'
						},
						{
							value: '9',
							label: 'Niedersachsen'
						},
						{
							value: '10',
							label: 'Nordrhein-Westfalen'
						},
						{
							value: '11',
							label: 'Rheinland-Pfalz'
						},
						{
							value: '12',
							label: 'Saarland'
						},
						{
							value: '13',
							label: 'Sachsen'
						},
						{
							value: '14',
							label: 'Sachsen-Anhalt'
						},
						{
							value: '15',
							label: 'Schleswig-Holstein'
						},
						{
							value: '16',
							label: 'Thüringen'
						},
						{
							value: '0',
							label: 'außerhalb Deutschlands'
						}
					],
					selectInputLabel: 'Bundesland auswählen*',
					useIconOption: false,
					isSearchable: false,
					menuPlacement: 'bottom'
				}
			}
		],
		voluntaryComponents: [
			{
				componentType: 'RadioButton',
				headline: 'Geschlecht',
				name: 'gender',
				radioButtons: [
					{
						inputId: 'female',
						label: 'Weiblich',
						checked: false
					},
					{
						inputId: 'male',
						label: 'Männlich',
						checked: false
					},
					{
						inputId: 'diverseGender',
						label: 'Divers',
						checked: false
					}
				]
			}
		]
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
		showPostCode: true
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
	},
	men: {
		consultingType: '20',
		useInformal: false,
		overline: 'Jungen- und Männerberatung',
		showEmail: true,
		showPostCode: true
	}
};

export default registrationData;

import { translate } from '../../resources/scripts/i18n/translate';

const registrationData = {
	addiction: {
		consultingType: '0',
		useInformal: false,
		overline: translate('registration.overline.addiction'),
		voluntaryComponents: [
			{
				componentType: 'RadioButton',
				headline: translate('user.userAddiction.relation.headline'),
				name: 'relation',
				radioButtons: [
					{
						inputId: 'affected',
						label: translate('user.userAddiction.relation.0'),
						checked: false
					},
					{
						inputId: 'relative',
						label: translate('user.userAddiction.relation.1'),
						checked: false
					},
					{
						inputId: 'otherType',
						label: translate('user.userAddiction.relation.2'),
						checked: false
					}
				]
			},
			{
				componentType: 'TagSelect',
				headline: translate(
					'user.userAddiction.addictiveDrugs.headline'
				),
				name: 'addictiveDrugs',
				tagSelects: [
					{
						id: 'alcohol',
						label: translate('user.userAddiction.addictiveDrugs.0')
					},
					{
						id: 'drugs',
						label: translate('user.userAddiction.addictiveDrugs.1')
					},
					{
						id: 'legalHighs',
						label: translate('user.userAddiction.addictiveDrugs.2')
					},
					{
						id: 'tabacco',
						label: translate('user.userAddiction.addictiveDrugs.3')
					},
					{
						id: 'medication',
						label: translate('user.userAddiction.addictiveDrugs.4')
					},
					{
						id: 'gambling',
						label: translate('user.userAddiction.addictiveDrugs.5')
					},
					{
						id: 'internetUse',
						label: translate('user.userAddiction.addictiveDrugs.6')
					},
					{
						id: 'eatingDisorder',
						label: translate('user.userAddiction.addictiveDrugs.7')
					},
					{
						id: 'otherDrug',
						label: translate('user.userAddiction.addictiveDrugs.8')
					}
				]
			},
			{
				componentType: 'SelectDropdown',
				headline: translate('user.userAddiction.age.headline'),
				name: 'age',
				item: {
					id: 'ageSelect',
					selectedOptions: [
						{
							value: '0',
							label: translate('user.userAddiction.age.0')
						},
						{
							value: '1',
							label: translate('user.userAddiction.age.1')
						},
						{
							value: '2',
							label: translate('user.userAddiction.age.2')
						},
						{
							value: '3',
							label: translate('user.userAddiction.age.3')
						},
						{
							value: '4',
							label: translate('user.userAddiction.age.4')
						},
						{
							value: '5',
							label: translate('user.userAddiction.age.5')
						}
					],
					selectInputLabel: translate(
						'user.userAddiction.age.selectLabel'
					),
					useIconOption: false,
					isSearchable: false,
					menuPlacement: 'bottom'
				}
			},
			{
				componentType: 'RadioButton',
				headline: translate('user.userAddiction.gender.headline'),
				name: 'gender',
				radioButtons: [
					{
						inputId: 'female',
						label: translate('user.userAddiction.gender.0'),
						checked: false
					},
					{
						inputId: 'male',
						label: translate('user.userAddiction.gender.1'),
						checked: false
					},
					{
						inputId: 'diverseGender',
						label: translate('user.userAddiction.gender.2'),
						checked: false
					}
				]
			}
		]
	},
	u25: {
		consultingType: '1',
		useInformal: true,
		overline: translate('registration.overline.u25'),
		requiredComponents: {
			age: {
				label: translate('user.userU25.age.selectLabel'),
				options: [
					{
						value: '0',
						label: translate('user.userU25.age.0')
					},
					{
						value: '1',
						label: translate('user.userU25.age.1')
					},
					{
						value: '2',
						label: translate('user.userU25.age.2')
					},
					{
						value: '3',
						label: translate('user.userU25.age.3')
					},
					{
						value: '4',
						label: translate('user.userU25.age.4')
					},
					{
						value: '5',
						label: translate('user.userU25.age.5')
					},
					{
						value: '6',
						label: translate('user.userU25.age.6')
					},
					{
						value: '7',
						label: translate('user.userU25.age.7')
					},
					{
						value: '8',
						label: translate('user.userU25.age.8')
					},
					{
						value: '9',
						label: translate('user.userU25.age.9')
					},
					{
						value: '10',
						label: translate('user.userU25.age.10')
					},
					{
						value: '11',
						label: translate('user.userU25.age.11')
					},
					{
						value: '12',
						label: translate('user.userU25.age.12')
					},
					{
						value: '13',
						label: translate('user.userU25.age.13')
					},
					{
						value: '14',
						label: translate('user.userU25.age.14')
					},
					{
						value: '15',
						label: translate('user.userU25.age.15')
					}
				]
			},
			state: {
				label: translate('user.userU25.state.selectLabel')
			}
		},
		voluntaryComponents: [
			{
				componentType: 'RadioButton',
				headline: translate('user.userU25.gender.headline'),
				name: 'gender',
				radioButtons: [
					{
						inputId: 'female',
						label: translate('user.userU25.gender.0'),
						checked: false
					},
					{
						inputId: 'male',
						label: translate('user.userU25.gender.1'),
						checked: false
					},
					{
						inputId: 'diverseGender',
						label: translate('user.userU25.gender.2'),
						checked: false
					}
				]
			}
		]
	},
	gemeinsamstatteinsam: {
		consultingType: '1',
		useInformal: true,
		overline: translate('registration.overline.gemeinsamstatteinsam'),
		requiredComponents: {
			age: {
				label: translate('user.userU25.age.selectLabel'),
				options: [
					{
						value: '50',
						label: translate('user.userU25.age.50')
					},
					{
						value: '51',
						label: translate('user.userU25.age.51')
					},
					{
						value: '52',
						label: translate('user.userU25.age.52')
					},
					{
						value: '53',
						label: translate('user.userU25.age.53')
					},
					{
						value: '54',
						label: translate('user.userU25.age.54')
					},
					{
						value: '55',
						label: translate('user.userU25.age.55')
					},
					{
						value: '56',
						label: translate('user.userU25.age.56')
					}
				]
			},
			state: {
				label: translate('user.userU25.state.selectLabel')
			}
		},
		voluntaryComponents: [
			{
				componentType: 'RadioButton',
				headline: translate('user.userU25.gender.headline'),
				name: 'gender',
				radioButtons: [
					{
						inputId: 'female',
						label: translate('user.userU25.gender.0'),
						checked: false
					},
					{
						inputId: 'male',
						label: translate('user.userU25.gender.1'),
						checked: false
					},
					{
						inputId: 'diverseGender',
						label: translate('user.userU25.gender.2'),
						checked: false
					}
				]
			}
		]
	},
	pregnancy: {
		consultingType: '2',
		useInformal: true,
		overline: translate('registration.overline.pregnancy')
	},
	parenting: {
		consultingType: '3',
		useInformal: false,
		overline: translate('registration.overline.parenting')
	},
	cure: {
		consultingType: '4',
		useInformal: false,
		overline: translate('registration.overline.cure')
	},
	debt: {
		consultingType: '5',
		useInformal: false,
		overline: translate('registration.overline.debt')
	},
	social: {
		consultingType: '6',
		useInformal: false,
		overline: translate('registration.overline.social')
	},
	seniority: {
		consultingType: '7',
		useInformal: false,
		overline: translate('registration.overline.seniority')
	},
	disability: {
		consultingType: '8',
		useInformal: false,
		overline: translate('registration.overline.disability')
	},
	planB: {
		consultingType: '9',
		useInformal: true,
		overline: translate('registration.overline.planB')
	},
	law: {
		consultingType: '10',
		useInformal: false,
		overline: translate('registration.overline.law')
	},
	offender: {
		consultingType: '11',
		useInformal: false,
		overline: translate('registration.overline.offender')
	},
	aids: {
		consultingType: '12',
		useInformal: false,
		overline: translate('registration.overline.aids')
	},
	rehabilitation: {
		consultingType: '13',
		useInformal: false,
		overline: translate('registration.overline.rehabilitation')
	},
	children: {
		consultingType: '14',
		useInformal: true,
		overline: translate('registration.overline.children')
	},
	kreuzbund: {
		consultingType: '15',
		useInformal: false,
		overline: translate('registration.overline.kreuzbund')
	},
	migration: {
		consultingType: '16',
		useInformal: false,
		overline: translate('registration.overline.migration')
	},
	emigration: {
		consultingType: '17',
		useInformal: false,
		overline: translate('registration.overline.emigration')
	},
	hospice: {
		consultingType: '18',
		useInformal: false,
		overline: translate('registration.overline.hospice')
	},
	regional: {
		consultingType: '19',
		useInformal: false,
		overline: translate('registration.overline.regional')
	},
	men: {
		consultingType: '20',
		useInformal: false,
		overline: translate('registration.overline.men')
	}
};

export default registrationData;

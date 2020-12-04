import {
	translate,
	handleNumericTranslation
} from '../../resources/scripts/i18n/translate';
import { getUserDataTranslateBase } from '../profile/profileHelpers';

const registrationData = {
	addiction: {
		consultingType: '0',
		useInformal: false,
		overline: translate('registration.overline.addiction'),
		showEmail: true,
		showPostCode: true,
		voluntaryComponents: [
			{
				componentType: 'RadioButton',
				headline: translate('user.userAddiction.relation.headline'),
				name: 'relation',
				radioButtons: [
					{
						inputId: 'affected',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'relation',
							0
						),
						checked: false
					},
					{
						inputId: 'relative',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'relation',
							1
						),
						checked: false
					},
					{
						inputId: 'otherType',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'relation',
							2
						),
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
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'addictiveDrugs',
							0
						)
					},
					{
						id: 'drugs',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'addictiveDrugs',
							1
						)
					},
					{
						id: 'legalHighs',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'addictiveDrugs',
							2
						)
					},
					{
						id: 'tabacco',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'addictiveDrugs',
							3
						)
					},
					{
						id: 'medication',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'addictiveDrugs',
							4
						)
					},
					{
						id: 'gambling',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'addictiveDrugs',
							5
						)
					},
					{
						id: 'internetUse',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'addictiveDrugs',
							6
						)
					},
					{
						id: 'eatingDisorder',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'addictiveDrugs',
							7
						)
					},
					{
						id: 'otherDrug',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'addictiveDrugs',
							8
						)
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
							label: handleNumericTranslation(
								getUserDataTranslateBase(0),
								'age',
								0
							)
						},
						{
							value: '1',
							label: handleNumericTranslation(
								getUserDataTranslateBase(0),
								'age',
								1
							)
						},
						{
							value: '2',
							label: handleNumericTranslation(
								getUserDataTranslateBase(0),
								'age',
								2
							)
						},
						{
							value: '3',
							label: handleNumericTranslation(
								getUserDataTranslateBase(0),
								'age',
								3
							)
						},
						{
							value: '4',
							label: handleNumericTranslation(
								getUserDataTranslateBase(0),
								'age',
								4
							)
						},
						{
							value: '5',
							label: handleNumericTranslation(
								getUserDataTranslateBase(0),
								'age',
								5
							)
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
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'gender',
							0
						),
						checked: false
					},
					{
						inputId: 'male',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'gender',
							1
						),
						checked: false
					},
					{
						inputId: 'diverseGender',
						label: handleNumericTranslation(
							getUserDataTranslateBase(0),
							'gender',
							2
						),
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
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								0
							)
						},
						{
							value: '1',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								1
							)
						},
						{
							value: '2',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								2
							)
						},
						{
							value: '3',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								3
							)
						},
						{
							value: '4',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								4
							)
						},
						{
							value: '5',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								5
							)
						},
						{
							value: '6',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								6
							)
						},
						{
							value: '7',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								7
							)
						},
						{
							value: '8',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								8
							)
						},
						{
							value: '9',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								9
							)
						},
						{
							value: '10',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								10
							)
						},
						{
							value: '11',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								11
							)
						},
						{
							value: '12',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								12
							)
						},
						{
							value: '13',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								13
							)
						},
						{
							value: '14',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								14
							)
						},
						{
							value: '15',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								15
							)
						}
					],
					selectInputLabel: translate('user.userU25.age.selectLabel'),
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
							label: translate('user.userU25.state.1')
						},
						{
							value: '2',
							label: translate('user.userU25.state.2')
						},
						{
							value: '3',
							label: translate('user.userU25.state.3')
						},
						{
							value: '4',
							label: translate('user.userU25.state.4')
						},
						{
							value: '5',
							label: translate('user.userU25.state.5')
						},
						{
							value: '6',
							label: translate('user.userU25.state.6')
						},
						{
							value: '7',
							label: translate('user.userU25.state.7')
						},
						{
							value: '8',
							label: translate('user.userU25.state.8')
						},
						{
							value: '9',
							label: translate('user.userU25.state.9')
						},
						{
							value: '10',
							label: translate('user.userU25.state.10')
						},
						{
							value: '11',
							label: translate('user.userU25.state.11')
						},
						{
							value: '12',
							label: translate('user.userU25.state.12')
						},
						{
							value: '13',
							label: translate('user.userU25.state.13')
						},
						{
							value: '14',
							label: translate('user.userU25.state.14')
						},
						{
							value: '15',
							label: translate('user.userU25.state.15')
						},
						{
							value: '16',
							label: translate('user.userU25.state.16')
						},
						{
							value: '0',
							label: translate('user.userU25.state.0')
						}
					],
					selectInputLabel: translate(
						'user.userU25.state.selectLabel'
					),
					useIconOption: false,
					isSearchable: false,
					menuPlacement: 'bottom'
				}
			}
		],
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
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								50
							)
						},
						{
							value: '51',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								51
							)
						},
						{
							value: '52',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								52
							)
						},
						{
							value: '53',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								53
							)
						},
						{
							value: '54',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								54
							)
						},
						{
							value: '55',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								55
							)
						},
						{
							value: '56',
							label: handleNumericTranslation(
								getUserDataTranslateBase(1),
								'age',
								56
							)
						}
					],
					selectInputLabel: translate('user.userU25.age.selectLabel'),
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
							label: translate('user.userU25.state.1')
						},
						{
							value: '2',
							label: translate('user.userU25.state.2')
						},
						{
							value: '3',
							label: translate('user.userU25.state.3')
						},
						{
							value: '4',
							label: translate('user.userU25.state.4')
						},
						{
							value: '5',
							label: translate('user.userU25.state.5')
						},
						{
							value: '6',
							label: translate('user.userU25.state.6')
						},
						{
							value: '7',
							label: translate('user.userU25.state.7')
						},
						{
							value: '8',
							label: translate('user.userU25.state.8')
						},
						{
							value: '9',
							label: translate('user.userU25.state.9')
						},
						{
							value: '10',
							label: translate('user.userU25.state.10')
						},
						{
							value: '11',
							label: translate('user.userU25.state.11')
						},
						{
							value: '12',
							label: translate('user.userU25.state.12')
						},
						{
							value: '13',
							label: translate('user.userU25.state.13')
						},
						{
							value: '14',
							label: translate('user.userU25.state.14')
						},
						{
							value: '15',
							label: translate('user.userU25.state.15')
						},
						{
							value: '16',
							label: translate('user.userU25.state.16')
						},
						{
							value: '0',
							label: translate('user.userU25.state.0')
						}
					],
					selectInputLabel: translate(
						'user.userU25.state.selectLabel'
					),
					useIconOption: false,
					isSearchable: false,
					menuPlacement: 'bottom'
				}
			}
		],
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
		overline: translate('registration.overline.pregnancy'),
		showEmail: true,
		showPostCode: true
	},
	parenting: {
		consultingType: '3',
		useInformal: false,
		overline: translate('registration.overline.parenting'),
		showEmail: true,
		showPostCode: true
	},
	cure: {
		consultingType: '4',
		useInformal: false,
		overline: translate('registration.overline.cure'),
		showEmail: true,
		showPostCode: true
	},
	debt: {
		consultingType: '5',
		useInformal: false,
		overline: translate('registration.overline.debt'),
		showEmail: true,
		showPostCode: true
	},
	social: {
		consultingType: '6',
		useInformal: false,
		overline: translate('registration.overline.social'),
		showEmail: true,
		showPostCode: true
	},
	seniority: {
		consultingType: '7',
		useInformal: false,
		overline: translate('registration.overline.seniority'),
		showEmail: true,
		showPostCode: true
	},
	disability: {
		consultingType: '8',
		useInformal: false,
		overline: translate('registration.overline.disability'),
		showEmail: true,
		showPostCode: true
	},
	planB: {
		consultingType: '9',
		useInformal: true,
		overline: translate('registration.overline.planB'),
		showEmail: true,
		showPostCode: true
	},
	law: {
		consultingType: '10',
		useInformal: false,
		overline: translate('registration.overline.law'),
		showEmail: true,
		showPostCode: true
	},
	offender: {
		consultingType: '11',
		useInformal: false,
		overline: translate('registration.overline.offender'),
		showEmail: true,
		showPostCode: true
	},
	aids: {
		consultingType: '12',
		useInformal: false,
		overline: translate('registration.overline.aids'),
		showEmail: true,
		showPostCode: true
	},
	rehabilitation: {
		consultingType: '13',
		useInformal: false,
		overline: translate('registration.overline.rehabilitation'),
		showEmail: true,
		showPostCode: false
	},
	children: {
		consultingType: '14',
		useInformal: true,
		overline: translate('registration.overline.children'),
		showEmail: true,
		showPostCode: true
	},
	kreuzbund: {
		consultingType: '15',
		useInformal: false,
		overline: translate('registration.overline.kreuzbund'),
		showEmail: true,
		showPostCode: false
	},
	migration: {
		consultingType: '16',
		useInformal: false,
		overline: translate('registration.overline.migration'),
		showEmail: true,
		showPostCode: true
	},
	emigration: {
		consultingType: '17',
		useInformal: false,
		overline: translate('registration.overline.emigration'),
		showEmail: true,
		showPostCode: true
	},
	hospice: {
		consultingType: '18',
		useInformal: false,
		overline: translate('registration.overline.hospice'),
		showEmail: true,
		showPostCode: true
	},
	regional: {
		consultingType: '19',
		useInformal: false,
		overline: translate('registration.overline.regional'),
		showEmail: true,
		showPostCode: true
	}
};

export default registrationData;

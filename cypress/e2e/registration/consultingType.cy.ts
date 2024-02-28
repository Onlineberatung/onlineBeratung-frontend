import merge from 'lodash.merge';
import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../../support/websocket';
import { config } from '../../../src/resources/scripts/config';

const generateConsultingTypes = (base, variations) =>
	variations.map((variation, i) => merge({}, base, { id: i + 1 }, variation));

const generateTopics = (base, variations) =>
	variations.map((variation, i) => merge({}, base, { id: i + 1 }, variation));

const generateAgencies = (base, variations) =>
	variations.map((variation, i) => merge({}, base, { id: i + 1 }, variation));

let consultingTypes, agencies, topics;

describe('Registration', () => {
	before(() => {
		startWebSocketServer();
	});

	after(() => {
		closeWebSocketServer();
	});

	beforeEach(() => {
		mockWebSocket();
	});

	describe('ConsultingType', () => {
		beforeEach(() => {
			cy.fixture('registration/consultingType')
				.then((consultingType) => {
					consultingTypes = generateConsultingTypes(consultingType, [
						{
							id: 1,
							slug: 'consultingType1',
							titles: {
								welcome: 'Test Title Consulting Type 1'
							}
						},
						{
							id: 2,
							slug: 'consultingType2',
							titles: {
								welcome: 'Test Title Consulting Type 2'
							}
						},
						{
							id: 3,
							slug: 'consultingType3'
						},
						{
							id: 4,
							slug: 'consultingType4',
							registration: {
								autoSelectPostcode: true
							}
						}
					]);
					cy.willReturn('consultingTypes', consultingTypes);
				})
				.as('consultingTypeFixture');
			cy.fixture('registration/agency')
				.then((agency) => {
					agencies = generateAgencies(agency, [
						{
							id: 11,
							name: 'Agency 11',
							consultingType: 1
						},
						{
							id: 12,
							name: 'Agency 12',
							consultingType: 1,
							external: true
						},
						{
							id: 13,
							name: 'Agency 13',
							consultingType: 1
						},
						{
							id: 21,
							name: 'Agency 21',
							consultingType: 2
						},
						{
							id: 22,
							name: 'Agency 22',
							consultingType: 2
						},
						{
							id: 31,
							name: 'Agency 31',
							consultingType: 3,
							external: true
						},
						{
							id: 41,
							name: 'Agency 41',
							consultingType: 4,
							external: true
						}
					]);
					cy.willReturn('agencies', agencies);
				})
				.as('agencyFixture');
		});

		describe('Without parameters', () => {
			beforeEach(() => {
				cy.visit('/consultingType1/registration');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.get('.stage').should('have.class', 'stage--ready');
			});

			it('should have consulting type loaded with title', () => {
				cy.window()
					.its('i18n')
					.then((i18n) => {
						i18n.changeLanguage('cimode');
					});
				cy.willReturn('consultingTypes').then((consultingTypes) => {
					cy.get('.registrationWelcome .headline').should(
						'have.text',
						consultingTypes[0].titles.welcome
					);
				});
			});

			it('should have registration steps', () => {
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.get('.formAccordionItem').should('have.length', 4);
			});

			describe('agency search', () => {
				beforeEach(() => {
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType without external', () => {
					cy.get('input#postcode').type('12345', { force: true });
					cy.wait('@service.agencies');
					// Check if both agencies from consultingType2 are listed
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-11'
					).should('exist');
					// Check if external agency from consultingType1 is hidden
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-12'
					).should('not.exist');
					// Check if one agency from other consultingType is hidden
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-21'
					).should('not.exist');
				});
			});
		});

		describe('With valid aid parameters', () => {
			beforeEach(() => {
				cy.visit('/consultingType1/registration?aid=11');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
			});

			describe('agency search', () => {
				beforeEach(() => {
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					// Check if both agencies from consultingType2 are listed
					cy.get('.preselectedAgency__item').should('have.length', 1);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.preselectedAgency__item .radioButton__input#11'
					).should('exist');
				});
			});
		});

		describe('With valid aid from other consultingType parameters', () => {
			beforeEach(() => {
				cy.visit('/consultingType1/registration?aid=21');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
			});

			describe('agency search', () => {
				beforeEach(() => {
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					// Check if no agency are preselected
					cy.get('.preselectedAgency__item').should('not.exist');
					// Check if search for agencies is working
					cy.get('input#postcode').type('12345', { force: true });
					cy.wait('@service.agencies');
					// Check if both agencies from consultingType2 are listed
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-11'
					).should('exist');
					// Check if external agency from consultingType1 is hidden
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-12'
					).should('not.exist');
					// Check if one agency from other consultingType is hidden
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-21'
					).should('not.exist');
				});
			});
		});

		describe('With invalid aid parameter', () => {
			beforeEach(() => {
				cy.visit('/consultingType1/registration?aid=999');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
			});

			describe('agency search', () => {
				beforeEach(() => {
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					// Check if no agency are preselected
					cy.get('.preselectedAgency__item').should('not.exist');
					// Check if search for agencies is working
					cy.get('input#postcode').type('12345', { force: true });
					cy.wait('@service.agencies');
					// Check if both agencies from consultingType2 are listed
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-11'
					).should('exist');
					// Check if external agency from consultingType1 is hidden
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-12'
					).should('not.exist');
					// Check if one agency from other consultingType is hidden
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-21'
					).should('not.exist');
				});
			});
		});

		describe('With all invalid parameter', () => {
			it('should redirect to config.urls.landingpage if no conditions for registration', () => {
				cy.visit(
					'/unknown/registration?cid=xxxx-xxxx-xxxx-xxxx&aid=999'
				);
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@agencyConsultants.id');
				cy.url().should('contain', config.urls.toRegistration);
			});
		});

		describe('Consultant [1 agency, 1 consultingType', () => {
			beforeEach(() => {
				cy.willReturn('agencies').then((agencies) => {
					cy.fixture('service.agency.consultants.json').then(
						(agencyConsultants) => {
							cy.willReturn(
								'agencyConsultants',
								agencyConsultants.map((c, k) => ({
									...c,
									agencies: [
										agencies.find(
											(a) => a.consultingType === k + 1
										)
									]
								}))
							);
						}
					);
				});
			});
			describe('With valid cid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					// Check if both agencies from consultingType2 are listed
					cy.get('.preselectedAgency__item').should('have.length', 1);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.preselectedAgency__item .radioButton__input#11'
					).should('exist');
				});
			});
			describe('With valid cid and aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91&aid=11'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@service.agencies.id');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					// Check if both agencies from consultingType2 are listed
					cy.get('.preselectedAgency__item').should('have.length', 1);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.preselectedAgency__item .radioButton__input#11'
					).should('exist');
				});
			});
			describe('With valid cid and invalid aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91&aid=21'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.wait('@service.agencies.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show all consultant agencies', () => {
					// Check if both agencies from consultingType2 are listed
					cy.get('.preselectedAgency__item').should('have.length', 1);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.preselectedAgency__item .radioButton__input#11'
					).should('exist');
				});
			});
			describe('With valid cid from other consultingType parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=a5dc222c-94c0-4c1b-9654-0a5c34008de6'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					// Check if both agencies from consultingType2 are listed
					cy.get('.preselectedAgency__item').should('have.length', 1);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.preselectedAgency__item .radioButton__input#21'
					).should('exist');
				});
			});
			describe('With valid cid from non existent consultingType parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/unknown/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					// Check if both agencies from consultingType2 are listed
					cy.get('.preselectedAgency__item').should('have.length', 1);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.preselectedAgency__item .radioButton__input#11'
					).should('exist');
				});
			});
		});
		describe('Consultant [2 agency, 1 consultingType', () => {
			beforeEach(() => {
				cy.willReturn('agencies').then((agencies) => {
					cy.fixture('service.agency.consultants.json').then(
						(agencyConsultants) => {
							cy.willReturn(
								'agencyConsultants',
								agencyConsultants.map((c, k) => ({
									...c,
									agencies: agencies.filter(
										(a) => a.consultingType === k + 1
									)
								}))
							);
						}
					);
				});
			});
			describe('With valid cid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-11'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-13'
					).should('exist');
				});
			});
			describe('With valid cid and aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91&aid=11'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@service.agencies.id');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					// Check if both agencies from consultingType2 are listed
					cy.get('.preselectedAgency__item').should('have.length', 1);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.preselectedAgency__item .radioButton__input#11'
					).should('exist');
				});
			});
			describe('With valid cid and invalid aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91&aid=21'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.wait('@service.agencies.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show all consultant agencies', () => {
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-11'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-13'
					).should('exist');
				});
			});
			describe('With valid cid from other consultingType parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=a5dc222c-94c0-4c1b-9654-0a5c34008de6'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-22'
					).should('exist');
				});
			});
			describe('With valid cid from non existent consultingType parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/unknown/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-11'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-13'
					).should('exist');
				});
			});
		});
		describe('Consultant [2 agency, multiple consultingTypes', () => {
			beforeEach(() => {
				cy.willReturn('agencies').then((agencies) => {
					cy.fixture('service.agency.consultants.json').then(
						(agencyConsultants) => {
							cy.willReturn(
								'agencyConsultants',
								agencyConsultants.map((c) => ({
									...c,
									agencies: agencies
								}))
							);
						}
					);
				});
			});
			describe('With valid cid parameters without consultingType', () => {
				beforeEach(() => {
					cy.visit(
						'/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show agencies with consultingtype dropdown', () => {
					cy.get('#consultingTypeSelection').should('exist');
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-11'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-13'
					).should('exist');

					cy.get('#consultingTypeSelection').click();
					cy.get('#consultingTypeSelection .select__input__option')
						.eq(1)
						.click();
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-22'
					).should('exist');
				});
			});
			describe('With valid cid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-11'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-13'
					).should('exist');
				});
			});
			describe('With valid cid and aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91&aid=11'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@service.agencies.id');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					cy.get('#consultingTypeSelection').should('not.exist');
					// Check if both agencies from consultingType2 are listed
					cy.get('.preselectedAgency__item').should('have.length', 1);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.preselectedAgency__item .radioButton__input#11'
					).should('exist');
				});
			});
			describe('With valid cid and invalid aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType1/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91&aid=21'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.wait('@service.agencies.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show all consultant agencies', () => {
					cy.get('#consultingTypeSelection').should('not.exist');
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-11'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-13'
					).should('exist');
				});
			});
			describe('With valid cid from other consultingType parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType2/registration?cid=a5dc222c-94c0-4c1b-9654-0a5c34008de6'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					cy.get('#consultingTypeSelection').should('not.exist');
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-22'
					).should('exist');
				});
			});
			describe('With valid cid from non existent consultingType parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/unknown/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					cy.get('#consultingTypeSelection').should('exist');
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-11'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-13'
					).should('exist');

					cy.get('#consultingTypeSelection').click();
					cy.get('#consultingTypeSelection .select__input__option')
						.eq(1)
						.click();
					cy.get('.agencySelection__proposedAgency').should(
						'have.length',
						2
					);
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencySelection__proposedAgency .radioButton__input#agency-22'
					).should('exist');
				});
			});
		});
		describe('With invalid cid parameter', () => {
			beforeEach(() => {
				cy.visit(
					'/consultingType1/registration?cid=xxxx-xxxx-xxxx-xxxx'
				);
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@agencyConsultants.id');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType', () => {
				// Check if no agency are preselected
				cy.get('.preselectedAgency__item').should('not.exist');
				// Check if search for agencies is working
				cy.get('input#postcode').type('12345', { force: true });
				cy.wait('@service.agencies');
				// Check if both agencies from consultingType2 are listed
				cy.get('.agencySelection__proposedAgency').should(
					'have.length',
					2
				);
				// Check if one agency from consultingType1 is visible
				cy.get(
					'.agencySelection__proposedAgency .radioButton__input#agency-11'
				).should('exist');
				// Check if external agency from consultingType1 is hidden
				cy.get(
					'.agencySelection__proposedAgency .radioButton__input#agency-13'
				).should('exist');
				// Check if one agency from other consultingType is hidden
				cy.get(
					'.agencySelection__proposedAgency .radioButton__input#agency-21'
				).should('not.exist');
			});
		});
		describe('With invalid cid and valid aid parameter', () => {
			beforeEach(() => {
				cy.visit(
					'/consultingType1/registration?cid=xxxx-xxxx-xxxx-xxxx&aid=11'
				);
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@agencyConsultants.id');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
			});

			describe('agency search', () => {
				beforeEach(() => {
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					// Check if both agencies from consultingType2 are listed
					cy.get('.preselectedAgency__item').should('have.length', 1);
					// Check if one agency from consultingType1 is visible
					cy.get(
						'.preselectedAgency__item .radioButton__input#11'
					).should('exist');
				});
			});
		});

		describe('agency search without autoselect postcode should hide external agency', () => {
			beforeEach(() => {
				cy.visit('/consultingType3/registration');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType without external', () => {
				cy.get('input#postcode').should('exist');
				cy.get('input#postcode').type('12345', { force: true });
				cy.wait('@service.agencies');
				// Check if no agencies found because external should be hidden without autoselectpostcode
				cy.get('.registrationForm__no-agency-found').should('exist');
			});
		});

		describe('agency search with autoselect postcode should show external agency', () => {
			beforeEach(() => {
				cy.visit('/consultingType4/registration');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType without external', () => {
				cy.get('input#postcode').should('not.exist');
				cy.wait('@service.agencies');
				// Check if no agencies found because external should be hidden without autoselectpostcode
				cy.get('.registrationForm__no-agency-found').should(
					'not.exist'
				);
				// Check if both agencies from consultingType2 are listed
				cy.get('.preselectedAgency__item').should('have.length', 1);
				// Check if one agency from consultingType1 is visible
				cy.get(
					'.preselectedAgency__item .radioButton__input#41'
				).should('exist');
			});
		});

		describe('agency search without autoselect postcode should hide external agency [valid aid]', () => {
			beforeEach(() => {
				cy.visit('/consultingType3/registration?aid=11');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType without external', () => {
				cy.get('input#postcode').should('exist');
				cy.get('input#postcode').type('12345', { force: true });
				cy.wait('@service.agencies');
				// Check if no agencies found because external should be hidden without autoselectpostcode
				cy.get('.registrationForm__no-agency-found').should('exist');
			});
		});

		describe('agency search with autoselect postcode should show external agency [invalid aid]', () => {
			beforeEach(() => {
				cy.visit('/consultingType4/registration?aid=21');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType without external', () => {
				cy.get('input#postcode').should('not.exist');
				// Check if no agencies found because external should be hidden without autoselectpostcode
				cy.get('.registrationForm__no-agency-found').should(
					'not.exist'
				);
				// Check if both agencies from consultingType2 are listed
				cy.get('.preselectedAgency__item').should('have.length', 1);
				// Check if one agency from consultingType1 is visible
				cy.get(
					'.preselectedAgency__item .radioButton__input#41'
				).should('exist');
			});
		});
	});
});

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
		Cypress.env('TENANT_ENABLED', '1');
		startWebSocketServer();
	});

	after(() => {
		closeWebSocketServer();
	});

	beforeEach(() => {
		mockWebSocket();

		cy.willReturn(
			'frontend.settings',
			{
				useTenantService: true,
				registration: {
					useConsultingTypeSlug: 1
				}
			},
			true
		);
		cy.willReturn(
			'service.tenant.public',
			{
				settings: {
					featureTopicsEnabled: true,
					topicsInRegistrationEnabled: true
				}
			},
			true
		);
		cy.willReturn(
			'settings',
			{
				multitenancyWithSingleDomainEnabled: {
					value: true,
					readOnly: true
				},
				useTenantService: {
					value: true,
					readOnly: true
				}
			},
			true
		);
	});

	describe('Topic', () => {
		beforeEach(() => {
			cy.fixture('registration/consultingType')
				.then((consultingType) => {
					consultingTypes = generateConsultingTypes(consultingType, [
						{
							id: 1,
							slug: 'consultingType',
							titles: {
								welcome: 'Test Title Consulting Type 1'
							}
						},
						{
							id: 2,
							slug: 'consultingType',
							titles: {
								welcome: 'Test Title Consulting Type 2'
							}
						},
						{
							id: 3,
							slug: 'consultingType'
						},
						{
							id: 4,
							slug: 'consultingType',
							registration: {
								autoSelectPostcode: true
							}
						}
					]);
					cy.willReturn('consultingTypes', consultingTypes);
				})
				.as('consultingTypeFixture');
			cy.fixture('registration/topic')
				.then((topic) => {
					topics = generateTopics(topic, [
						{
							id: 11,
							name: 'Topic 11'
						},
						{
							id: 12,
							name: 'Topic 12'
						},
						{
							id: 21,
							name: 'Topic 21'
						},
						{
							id: 22,
							name: 'Topic 22'
						},
						{
							id: 31,
							name: 'Topic 31'
						},
						{
							id: 41,
							name: 'Topic 41'
						}
					]);
					cy.willReturn('topics', topics);
				})
				.as('topicFixture');
			cy.fixture('registration/agency')
				.then((agency) => {
					agencies = generateAgencies(agency, [
						{
							id: 11,
							name: 'Agency 11',
							consultingType: 1,
							topicIds: [11]
						},
						{
							id: 12,
							name: 'Agency 12',
							consultingType: 1,
							external: true,
							topicIds: [12]
						},
						{
							id: 13,
							name: 'Agency 13',
							consultingType: 1,
							topicIds: [11, 12]
						},
						{
							id: 21,
							name: 'Agency 21',
							consultingType: 2,
							topicIds: [21, 22]
						},
						{
							id: 22,
							name: 'Agency 22',
							consultingType: 2,
							topicIds: [21, 22]
						},
						{
							id: 23,
							name: 'Agency 23',
							consultingType: 2
						},
						{
							id: 24,
							name: 'Agency 24',
							consultingType: 2,
							external: true,
							topicIds: [21, 22]
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
							external: true,
							topicIds: [41]
						}
					]);
					cy.willReturn('agencies', agencies);
				})
				.as('agencyFixture');
		});

		describe('Without parameters', () => {
			beforeEach(() => {
				cy.visit('/consultingType/registration');
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
				cy.get('.formAccordionItem').should('have.length', 5);
			});

			describe('agency search', () => {
				beforeEach(() => {
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
				});

				it('should find agencies for all consultingTypes without external', () => {
					cy.get('.mainTopicSelection').should('exist');
					cy.get('.formAccordionItem').eq(2).click();
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 6);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-31-31'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-41-41'
					).should('exist');

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).click();

					cy.get('.formAccordionItem').eq(3).click();
					cy.get('input#postcode').type('12345', { force: true });
					cy.wait('@service.agencies');

					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-22'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-23'
					).should('not.exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-24'
					).should('not.exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('not.exist');
				});
			});
		});

		describe('With valid aid parameters', () => {
			beforeEach(() => {
				cy.visit('/consultingType/registration?aid=11');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.wait('@topics');
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should filter topics show preselected agency', () => {
				cy.get('.mainTopicSelection .mainTopicSelection__topic').should(
					'have.length',
					1
				);
				// Check if one agency from consultingType1 is visible
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-11-11'
				).should('exist');
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-12-12'
				).should('not.exist');

				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-11-11'
				).click();

				cy.get('.formAccordionItem').eq(3).click();

				// Check if both agencies from consultingType2 are listed
				cy.get('.agencyRadioSelect__wrapper').should('have.length', 1);
				// Check if one agency from consultingType1 is visible
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
				).should('exist');
			});
		});

		describe('With valid aid with multiple topics', () => {
			beforeEach(() => {
				cy.visit('/consultingType/registration?aid=13');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.wait('@topics');
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType', () => {
				cy.get('.mainTopicSelection .mainTopicSelection__topic').should(
					'have.length',
					2
				);
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-11-11'
				).should('exist');
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-12-12'
				).should('exist');
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-21-21'
				).should('not.exist');

				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-12-12'
				).click();
				cy.get('.formAccordionItem').eq(3).click();

				cy.get('.agencyRadioSelect__wrapper').should('have.length', 1);
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-13'
				).should('exist');
			});
		});

		describe('With invalid aid parameter', () => {
			beforeEach(() => {
				cy.visit('/consultingType/registration?aid=999');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.wait('@topics');
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should show all topics and agencies', () => {
				// Check if both agencies from consultingType2 are listed
				cy.get('.mainTopicSelection').should('exist');
				cy.get('.formAccordionItem').eq(2).click();
				cy.get('.mainTopicSelection .mainTopicSelection__topic').should(
					'have.length',
					6
				);
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-11-11'
				).should('exist');
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-21-21'
				).should('exist');
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-31-31'
				).should('exist');
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-41-41'
				).should('exist');

				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-21-21'
				).click();

				cy.get('.formAccordionItem').eq(3).click();
				cy.get('input#postcode').type('12345', { force: true });
				cy.wait('@service.agencies');

				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
				).should('exist');
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-22'
				).should('exist');
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-23'
				).should('not.exist');
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-24'
				).should('not.exist');
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
				).should('not.exist');
			});
		});

		describe('With all (cid, tid, aid) invalid parameter', () => {
			it('should redirect to config.urls.landingpage if no conditions for registration', () => {
				cy.visit(
					'/unknown/registration?cid=xxxx-xxxx-xxxx-xxxx&aid=999&tid=999'
				);
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@service.agencies.id');
				cy.wait('@agencyConsultants.id');
				cy.url().should('contain', config.urls.toRegistration);
			});
		});

		describe('Consultant [1 agency, 1 topic]', () => {
			beforeEach(() => {
				cy.willReturn('agencies').then((agencies) => {
					cy.fixture('service.agency.consultants.json').then(
						(agencyConsultants) => {
							cy.willReturn(
								'agencyConsultants',
								agencyConsultants.map((c, k) => ({
									...c,
									agencies: [
										agencies.find((a) =>
											a.topicIds?.some(
												(tid) =>
													tid >= (k + 1) * 10 &&
													tid < (k + 2) * 10
											)
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
						'/consultingType/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						1
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('exist');
				});
			});
			describe('With valid cid and aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=11&cid=8a81117b-d875-4ba4-8696-d62c3a2dae91&aid=11'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@service.agencies.id');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						1
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('exist');
				});
			});

			describe('With valid tid & cid and invalid aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=11&cid=8a81117b-d875-4ba4-8696-d62c3a2dae91&aid=21'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@service.agencies.id');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show all consultant agencies', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						1
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('exist');
				});
			});

			describe('With valid cid from other topic parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=11&cid=a5dc222c-94c0-4c1b-9654-0a5c34008de6'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for tid', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 2);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('not.exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('exist');

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).click();

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						1
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
					).should('exist');
				});
			});
			describe('With valid cid from non existent tid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=999&cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('exist');

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						1
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('exist');
				});
			});
		});
		describe('Consultant [2 agency, 1 topic', () => {
			beforeEach(() => {
				cy.willReturn('agencies').then((agencies) => {
					cy.fixture('service.agency.consultants.json').then(
						(agencyConsultants) => {
							cy.willReturn(
								'agencyConsultants',
								agencyConsultants.map((c, k) => ({
									...c,
									agencies: agencies.filter((a) =>
										a.topicIds?.some(
											(tid) =>
												tid >= (k + 1) * 10 &&
												tid < (k + 2) * 10
										)
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
						'/consultingType/registration?tid=21&cid=a5dc222c-94c0-4c1b-9654-0a5c34008de6'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-22-22'
					).should('not.exist');

					cy.get('.formAccordionItem').eq(3).click();

					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-22'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('not.exist');
				});
			});
			describe('With valid cid and aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=21&cid=a5dc222c-94c0-4c1b-9654-0a5c34008de6&aid=21'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.wait('@service.agencies.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('not.exist');

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						1
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
					).should('exist');
				});
			});
			describe('With valid cid and invalid aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=21&cid=a5dc222c-94c0-4c1b-9654-0a5c34008de6&aid=11'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.wait('@service.agencies.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show all consultant agencies', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('not.exist');

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						2
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-22'
					).should('exist');
				});
			});
			describe('With valid cid from other tid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=11&cid=a5dc222c-94c0-4c1b-9654-0a5c34008de6'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 2);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('not.exist');

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).click();

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						2
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-23'
					).should('not.exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('not.exist');
				});
			});
			describe('With valid cid from non existent tid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=999&cid=a5dc222c-94c0-4c1b-9654-0a5c34008de6'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 2);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('not.exist');

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).click();

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						2
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-23'
					).should('not.exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('not.exist');
				});
			});
		});
		describe('Consultant [2 agency, multiple topics', () => {
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
			describe('With valid cid parameters without tid', () => {
				beforeEach(() => {
					cy.visit(
						'/registration?cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show agencies with topic select', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 5);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('exist');

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).click();

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						2
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('not.exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-13'
					).should('not.exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-22'
					).should('exist');
				});
			});
			describe('With valid cid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=11&cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('not.exist');

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).click();

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						2
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-13'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
					).should('not.exist');
				});
			});
			describe('With valid cid and aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=11&cid=8a81117b-d875-4ba4-8696-d62c3a2dae91&aid=11'
					);
					cy.wait('@service.agencies.id');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show preselected agency', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('not.exist');

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						1
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('exist');
				});
			});
			describe('With valid cid and invalid aid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=11&cid=8a81117b-d875-4ba4-8696-d62c3a2dae91&aid=21'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.wait('@service.agencies.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should show all consultant agencies', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('not.exist');

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						2
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-13'
					).should('exist');
				});
			});
			describe('With valid cid from other tid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=11&cid=a5dc222c-94c0-4c1b-9654-0a5c34008de6'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 1);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('not.exist');

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						2
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-13'
					).should('exist');
				});
			});
			describe('With valid cid from non existent tid parameters', () => {
				beforeEach(() => {
					cy.visit(
						'/consultingType/registration?tid=99&cid=8a81117b-d875-4ba4-8696-d62c3a2dae91'
					);
					cy.wait('@consultingTypeServiceBySlugFull');
					cy.wait('@agencyConsultants.id');
					cy.get('.stage').should('have.class', 'stage--ready');
					cy.get('[data-cy=close-welcome-screen]').click();
					cy.wait('@topics');
					cy.get('.formAccordionItem').eq(2).click();
				});

				it('should find agencies for consultingType', () => {
					cy.get(
						'.mainTopicSelection .mainTopicSelection__topic'
					).should('have.length', 5);

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-11-11'
					).should('exist');
					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).should('exist');

					cy.get(
						'.mainTopicSelection__topic .radioButton__input#topic-21-21'
					).click();

					cy.get('.formAccordionItem').eq(3).click();

					cy.get('.agencyRadioSelect__wrapper').should(
						'have.length',
						2
					);
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
					).should('not.exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-13'
					).should('not.exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
					).should('exist');
					cy.get(
						'.agencyRadioSelect__wrapper .radioButton__input#agency-22'
					).should('exist');
				});
			});
		});
		describe('With invalid cid parameter', () => {
			beforeEach(() => {
				cy.visit(
					'/consultingType/registration?tid=11&cid=xxxx-xxxx-xxxx-xxxx'
				);
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@agencyConsultants.id');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.wait('@topics');
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType', () => {
				cy.get('.mainTopicSelection .mainTopicSelection__topic').should(
					'have.length',
					1
				);

				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-11-11'
				).should('exist');
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-21-21'
				).should('not.exist');

				cy.get('.formAccordionItem').eq(3).click();

				cy.get('input#postcode').type('12345', { force: true });
				cy.wait('@service.agencies');

				cy.get('.agencyRadioSelect__wrapper').should('have.length', 2);
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
				).should('exist');
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-13'
				).should('exist');
			});
		});
		describe('With invalid cid and valid aid parameter', () => {
			beforeEach(() => {
				cy.visit(
					'/consultingType/registration?tid=11&cid=xxxx-xxxx-xxxx-xxxx&aid=11'
				);
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@agencyConsultants.id');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.wait('@topics');
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType', () => {
				cy.get('.mainTopicSelection .mainTopicSelection__topic').should(
					'have.length',
					1
				);

				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-11-11'
				).should('exist');
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-21-21'
				).should('not.exist');

				cy.get('.formAccordionItem').eq(3).click();

				cy.get('.agencyRadioSelect__wrapper').should('have.length', 1);
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
				).should('exist');
			});
		});

		describe('agency search without autoselect postcode should hide external agency', () => {
			beforeEach(() => {
				cy.visit('/consultingType/registration?tid=11');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.wait('@topics');
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType without external', () => {
				cy.get('.mainTopicSelection .mainTopicSelection__topic').should(
					'have.length',
					1
				);

				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-11-11'
				).should('exist');
				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-21-21'
				).should('not.exist');

				cy.get('.formAccordionItem').eq(3).click();

				cy.get('input#postcode').should('exist');
				cy.get('input#postcode').type('12345', { force: true });
				cy.wait('@service.agencies');

				cy.get('.agencyRadioSelect__wrapper').should('have.length', 2);
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
				).should('exist');
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-13'
				).should('exist');
			});
		});

		describe('agency search with autoselect postcode should show external agency', () => {
			beforeEach(() => {
				cy.willReturn('consultingTypes').then((consultingTypes) => {
					cy.willReturn(
						'consultingTypes',
						consultingTypes.map((c) => ({
							...c,
							registration: {
								autoSelectPostcode: true
							}
						}))
					);
				});

				cy.visit('/consultingType/registration?tid=41');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.wait('@topics');
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType without external', () => {
				cy.get('.mainTopicSelection .mainTopicSelection__topic').should(
					'have.length',
					1
				);

				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-41-41'
				).should('exist');

				cy.get('.formAccordionItem').eq(3).click();

				cy.get('input#postcode').should('not.exist');

				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-41'
				).should('exist');
			});
		});

		describe('agency search without autoselect postcode should hide external agency [valid aid]', () => {
			beforeEach(() => {
				cy.visit('/consultingType/registration?tid=11&aid=12');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.wait('@topics');
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType without external', () => {
				cy.get('.mainTopicSelection .mainTopicSelection__topic').should(
					'have.length',
					1
				);

				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-11-11'
				).should('exist');

				cy.get('.formAccordionItem').eq(3).click();

				cy.get('input#postcode').type('12345', { force: true });
				cy.wait('@service.agencies');

				cy.get('.agencyRadioSelect__wrapper').should('have.length', 2);
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
				).should('exist');
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-13'
				).should('exist');
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-12'
				).should('not.exist');

				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-12'
				).should('not.exist');
			});
		});

		describe('agency search with autoselect postcode should show external agency [invalid aid]', () => {
			beforeEach(() => {
				cy.visit('/consultingType/registration?tid=11&aid=21');
				cy.wait('@consultingTypeServiceBySlugFull');
				cy.wait('@service.agencies.id');
				cy.get('.stage').should('have.class', 'stage--ready');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.wait('@topics');
				cy.get('.formAccordionItem').eq(2).click();
			});

			it('should find agencies for consultingType without external', () => {
				cy.get('.mainTopicSelection .mainTopicSelection__topic').should(
					'have.length',
					1
				);

				cy.get(
					'.mainTopicSelection__topic .radioButton__input#topic-11-11'
				).should('exist');

				cy.get('.formAccordionItem').eq(3).click();

				cy.get('input#postcode').type('12345', { force: true });
				cy.wait('@service.agencies');

				cy.get('.agencyRadioSelect__wrapper').should('have.length', 2);
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-11'
				).should('exist');
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-13'
				).should('exist');
				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
				).should('not.exist');

				cy.get(
					'.agencyRadioSelect__wrapper .radioButton__input#agency-21'
				).should('not.exist');
			});
		});
	});
});

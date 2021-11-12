import { config } from '../../src/resources/scripts/config';

describe('profile', () => {
	beforeEach(() => {
		cy.fixture('service.consultingtypes.addiction.json').then(
			(addictionConsultingType) => {
				cy.fixture('service.consultingtypes.u25.json').then(
					(u25ConsultingType) => {
						cy.intercept(
							`${config.endpoints.consultingTypeServiceBase}/basic`,
							[addictionConsultingType, u25ConsultingType]
						);
					}
				);
			}
		);
	});

	it.skip('can register for a new consulting type with an external agency', () => {
		cy.intercept(
			config.endpoints.agencyServiceBase +
				'?postcode=00000&consultingType=0',
			[
				{
					id: 1,
					name: 'Schwangerschaftsberatung Baden',
					postcode: '00000',
					city: 'Basen',
					description:
						'Beraterinnen der Schwangerschaftsberatung der Diakonie in Baden antworten auf Ihre Fragen und begleiten Sie online bei Ihren Überlegungen.',
					teamAgency: true,
					offline: false,
					consultingType: 1,
					external: true,
					url: 'https://www.onlineberatung-diakonie-baden.de/'
				}
			]
		);

		cy.caritasMockedLogin();
		cy.visit('/beratung-hilfe.html', {
			onBeforeLoad(window) {
				cy.spy(window, 'open').as('windowOpen');
			}
		});
		cy.contains('Profil').click();

		cy.get('#consultingTypeSelect').click();
		cy.get('.select__input__option:contains("Suchtberatung")').click();

		cy.get('[name="postcode"]').type('00000');
		cy.contains('Schwangerschaftsberatung Baden');
		cy.contains('Registrieren').click();
		cy.contains(
			'Ihre gewählte Beratungsstelle nutzt eine andere Anwendung für die Beratung'
		);
		cy.contains(
			'Möchten Sie für „Suchtberatung“ zu der anderen Anwendung wechseln und sich dort registrieren? Ihre bisherigen Beratungs- und Hilfethemen finden Sie weiterhin hier.'
		);

		cy.contains('Jetzt wechseln').click();
		cy.get('@windowOpen').should(
			'be.calledWith',
			'https://www.onlineberatung-diakonie-baden.de/',
			'_blank'
		);
	});

	it('can register for a new consulting type with an internal agency', () => {
		cy.intercept(
			config.endpoints.agencyServiceBase +
				'?postcode=00000&consultingType=0',
			[
				{
					id: 1,
					name: 'Schwangerschaftsberatung Baden',
					postcode: '00000',
					city: 'Basen',
					description:
						'Beraterinnen der Schwangerschaftsberatung der Diakonie in Baden antworten auf Ihre Fragen und begleiten Sie online bei Ihren Überlegungen.',
					teamAgency: true,
					offline: false,
					consultingType: 1,
					external: false
				}
			]
		);

		cy.intercept(config.endpoints.registerAskerNewConsultingType, {
			sessionId: 902,
			status: 'CREATED'
		});

		cy.caritasMockedLogin();
		cy.contains('Profil').click();

		cy.get('#consultingTypeSelect').click();
		cy.get('.select__input__option:contains("Suchtberatung")').click();

		cy.get('[name="postcode"]').type('00000');
		cy.contains('Schwangerschaftsberatung Baden');
		cy.contains('Registrieren').click();

		cy.contains(
			'Sie haben sich erfolgreich für ein neues Themenfeld registriert.'
		);
	});
});

import { config } from '../../src/resources/scripts/config';

describe('Login', () => {
	it('should be able to login', () => {
		cy.caritasMockedLogin();

		cy.get('#appRoot').should('exist');
	});

	it('displays the login at the root', () => {
		cy.visit('/');
		cy.contains('Login');
		cy.contains('Impressum')
			.closest('a')
			.should('have.attr', 'href', 'https://www.caritas.de/impressum');
		cy.contains('Datenschutzerklärung')
			.closest('a')
			.should(
				'have.attr',
				'href',
				'https://www.caritas.de/hilfeundberatung/onlineberatung/datenschutz'
			);
	});

	it('displays the login for resorts', () => {
		cy.fixture('service.consultingtypes.addiction.json').then(
			(addictionConsultingType) => {
				cy.intercept(
					`${config.endpoints.consultingTypeServiceBase}/byslug/suchtberatung/full`,
					addictionConsultingType
				);
			}
		);
		cy.visit('/suchtberatung');
		cy.contains('Login');
	});
});

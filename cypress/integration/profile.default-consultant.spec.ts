import { config } from '../../src/resources/scripts/config';

describe('Default consultant profile', () => {
	const checkConsultantProfile = () => {
		cy.fixture('service.consultant.stats').then((consultantStats) => {
			cy.intercept(
				config.endpoints.consultantStatistics,
				consultantStats
			);
		});
		cy.caritasMockedLogin({ type: 'consultant' });
		cy.contains('Profil').click();
	};

	it('should login, check impressum and privacy data links', () => {
		checkConsultantProfile();
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

	it('should enable absence mode and set message', () => {
		cy.intercept(config.endpoints.setAbsence, {});
		cy.get('#absenceForm').get('#isAbsent').click();
		cy.get('input[id="absence"]')
			.focus()
			.type(
				'Having a well deserved rest in the Antartica with some penguins'
			);
		cy.get('#absenceButton').click();
		cy.get('.overlay__buttons').get('button').contains('Schließen').click();
	});

	it('should reset consultant password and login with new one', () => {
		cy.intercept(config.endpoints.passwordReset, {});
		cy.get('input[id="passwordResetOld"]').focus().type('password');
		cy.get('input[id="passwordResetNew"]').focus().type('Password123!');
		cy.get('input[id="passwordResetConfirm"]').focus().type('Password123!');
		cy.intercept(config.endpoints.rocketchatLogout, {});
		cy.get('#passwordResetButton').click();
		cy.get('.overlay__buttons').get('button').contains('Zum Login').click();

		cy.caritasMockedLogin(
			{
				type: 'consultant'
			},
			{
				testUsername: 'username',
				testPassword: 'Password123!'
			}
		);
		cy.get('.navigation__title').contains('Abmelden').click();
	});

	it('should check statistics and download them', () => {
		checkConsultantProfile();
		cy.get('#statisticsSelect').contains('letzten Monats').click();
		cy.get('.select__input__option:contains("letzten Monats")').click();
		cy.get('a').contains('Excel Datei').click();
	});

	it('should edit consultant email and full name', () => {
		cy.intercept(config.endpoints.userData, {});
		cy.get('.profile__content__title')
			.get('.editableData__inputButton')
			.click()
			.get('#E-Mail-Adresse')
			.focus()
			.type('test@test.com')
			.get('#Vorname')
			.focus()
			.type('AnotherName')
			.get('#Nachname')
			.focus()
			.type('AnotherLastName')
			.get('.button__item')
			.contains('Speichern')
			.click();
		cy.caritasMockedLogin(
			{
				type: 'consultant'
			},
			{
				testUsername: 'test@test.com',
				testPassword: 'password'
			}
		);
	});

	it('should check 2FA form', () => {
		checkConsultantProfile();
		cy.get('.twoFactorAuth__switch').click();
		cy.get('.twoFactorAuth__tools')
			.get('span')
			.contains('FreeOTP App')
			.get('span')
			.contains('Download im Google Play Store');
		cy.get('span').contains('Download im Apple App Store');
		cy.get('span').contains('Google Authenticator App');

		cy.get('.overlay__buttons').get('button').contains('Weiter').click();
		cy.get('.overlay__buttons').get('button').contains('Weiter').click();
		cy.get('.overlay__content').get('.overlay__closeIcon').click();

		cy.get('.navigation__title').contains('Abmelden').click();
	});
});

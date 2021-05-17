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
		cy.visit('/suchtberatung');
		cy.contains('Login');
	});
});

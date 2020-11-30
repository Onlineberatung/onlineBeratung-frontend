describe('Login', () => {
	it('should be able to login', () => {
		cy.caritasMockedLogin();

		cy.get('.app').should('exist');
	});
});

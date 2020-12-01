describe('Login', () => {
	it('should be able to login', () => {
		cy.caritasMockedLogin();

		cy.get('#appRoot').should('exist');
	});
});

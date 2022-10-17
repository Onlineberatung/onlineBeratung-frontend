describe('error', () => {
	it('should render 401 correctly', () => {
		cy.visit('/error.401.html');
		cy.get('[data-errortype="401"]').should('exist');
	});

	it('should render 404 correctly', () => {
		cy.visit('/error.404.html');
		cy.get('[data-errortype="404"]').should('exist');
	});

	it('should render 500 correctly', () => {
		cy.visit('/error.500.html');
		cy.get('[data-errortype="500"]').should('exist');
	});
});

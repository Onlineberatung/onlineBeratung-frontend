describe('under-construction', () => {
	it('should render correctly', () => {
		cy.visit('/under-construction.html');
		cy.get('[data-errortype="construction"]').should('exist');
	});
});

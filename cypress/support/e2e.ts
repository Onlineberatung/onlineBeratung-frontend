import 'cypress-file-upload';
import './commands';

beforeEach(() => {
	window.localStorage.setItem('locale', 'de');
	window.localStorage.setItem('showDevTools', '0');
});

afterEach(() => {
	cy.window().then((win) => {
		win.location.href = 'about:blank';
	});
	cy.url().should('eq', 'about:blank');
});

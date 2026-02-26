import 'cypress-file-upload';
import './commands';

beforeEach(() => {
	window.localStorage.setItem('locale', 'de');
	window.localStorage.setItem('showDevTools', '0');

	cy.mockApi();
	cy.fixture('service.settings.json').then((content) => {
		cy.willReturn('settings', content);
	});
	cy.fixture('service.tenant.public.json').then((content) => {
		cy.willReturn('service.tenant.public', content);
	});
});

afterEach(() => {
	cy.window().then((win) => {
		win.location.href = 'about:blank';
	});
	cy.url().should('eq', 'about:blank');
});

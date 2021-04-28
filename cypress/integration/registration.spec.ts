import { config } from '../../src/resources/scripts/config';

const checkForGenericRegistrationElements = () => {
	cy.get('#loginLogoWrapper').should('exist');
	cy.get('[data-consultingtype]').should('exist');
	cy.get('.registrationForm__overline').should('exist');
	cy.get('.registrationForm__headline').should('exist');
	cy.get('#username').should('exist');
	cy.get('#passwordInput').should('exist');
	cy.get('#passwordConfirmation').should('exist');
	cy.get('#dataProtectionCheckbox').should('exist');
	cy.get('.button__primary').should('exist');
	cy.get('.registrationForm__toLogin').should('exist');
};

describe('registration', () => {
	describe('addiction', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/suchtberatung/registration');
			cy.title().should('be.equal', 'Registrierung Suchtberatung');
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/suchtberatung/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('u25', () => {
		it('should redirect to helpmail when no aid is given', () => {
			cy.visit('/u25/registration');
			cy.url().then((url) => {
				expect(url).to.contain('https://www.u25.de/helpmail/');
			});
		});

		it('should have all generic registration page elements', () => {
			cy.fixture('service.agencies.json').then((agencies) => {
				cy.visit('/u25/registration?aid=1');
				cy.title().should(
					'be.equal',
					'Registrierung Beratung für Suizidgefährdete junge Menschen [U25]'
				);
				cy.get('[data-cy=close-welcome-screen]').click();
				checkForGenericRegistrationElements();
			});
		});

		it('should have a password reset info text', () => {
			cy.fixture('service.agencies.json').then((agencies) => {
				cy.visit('/u25/registration?aid=1');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.get('[data-cy=no-password-reset-possible-note]').should(
					'exist'
				);
			});
		});

		it('should have an agency info when aid is given', () => {
			cy.fixture('service.agencies.json').then((agencies) => {
				cy.intercept(config.endpoints.agencyServiceBase, agencies);
				cy.visit('/u25/registration?aid=1');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.get('[data-cy=show-preselected-agency]').should('exist');
				cy.get('[data-cy=show-preselected-agency]').contains(
					agencies[0].name
				);
			});
		});

		it('should be able to register', () => {
			cy.fixture('service.agencies.json').then((agencies) => {
				cy.intercept(config.endpoints.agencyServiceBase, agencies);
				cy.visit('/u25/registration?aid=1');
				cy.get('[data-cy=close-welcome-screen]').click();
				cy.get('[data-cy=show-preselected-agency]').should('exist');
				cy.get('[data-cy=show-preselected-agency]').contains(
					agencies[0].name
				);
				cy.get('input[id="username"]').focus().type('u25-user');
				cy.contains('Weiter').click();
				cy.get('input[id="passwordInput"]')
					.focus()
					.type('Password123!');
				cy.get('input[id="passwordConfirmation"]')
					.focus()
					.type('Password123!');
				cy.get('button:contains("Weiter"):visible').click();
				cy.contains('Alter auswählen*').click();
				cy.get('[id^="react-select"]:contains("unter 12")').click();
				cy.get('button:contains("Weiter"):visible').click();
				cy.contains('Bundesland auswählen*').click();
				cy.get('[id^="react-select"]:contains("Bayern")').click();
				cy.get('#dataProtectionLabel').click();
				cy.contains('Registrieren').should('be.enabled');
			});
		});
	});

	describe('pregnancy', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/schwangerschaftsberatung/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Schwangerschaftsberatung'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/schwangerschaftsberatung/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('parenting', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/eltern-familie/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Beratung für Eltern und Familien'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/eltern-familie/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('cure', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/kurberatung/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Kurberatung für Mütter und Väter'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/kurberatung/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('debt', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/schuldnerberatung/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Beratung zum Thema Schulden'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/schuldnerberatung/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('social', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/allgemeine-soziale-beratung/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Allgemeine Sozialberatung'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/allgemeine-soziale-beratung/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('seniority', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/leben-im-alter/registration');
			cy.title().should('be.equal', 'Registrierung Leben im Alter');
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/leben-im-alter/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('disability', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/behinderung-und-psychische-erkrankung/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Leben mit Behinderung und psychischer Erkrankung'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/behinderung-und-psychische-erkrankung/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('planB', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/mein-planb/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Mein PlanB: Beratung zwischen Schule und Beruf'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/mein-planb/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('law', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/rechtliche-betreuung/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Rechtliche Betreuung und Vorsorge'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/rechtliche-betreuung/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('offender', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/straffaelligkeit/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Beratung für Angehörige von Straffälligen'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/straffaelligkeit/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('aids', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/hiv-aids-beratung/registration');
			cy.title().should('be.equal', 'Registrierung HIV/AID-Beratung');
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/hiv-aids-beratung/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('rehabilitation', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/kinder-reha/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Kinder- und Jugend-Rehabilitation'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/kinder-reha/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('children', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/kinder-jugendliche/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Beratung für Kinder und Jugendliche'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/kinder-jugendliche/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('kreuzbund', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/kb-sucht-selbsthilfe/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Sucht-Selbsthilfe – Kreuzbund-Chat'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/kb-sucht-selbsthilfe/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('migration', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/migration/registration');
			cy.title().should('be.equal', 'Registrierung Migrationsberatung');
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/migration/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('emigration', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/rw-auswanderung/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Aus-/Rück- & Weiterwanderung'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/rw-auswanderung/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('hospice', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/hospiz-palliativ/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Hospiz-, Palliativ- und Trauerberatung'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/hospiz-palliativ/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('regional', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/regionale-angebote/registration');
			cy.title().should('be.equal', 'Registrierung Regionale Angebote');
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/regionale-angebote/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});

	describe('men', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/jungen-und-maenner/registration');
			cy.title().should(
				'be.equal',
				'Registrierung Jungen- und Männerberatung'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/jungen-und-maenner/registration');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=no-password-reset-possible-note]').should(
				'not.exist'
			);
		});
	});
});

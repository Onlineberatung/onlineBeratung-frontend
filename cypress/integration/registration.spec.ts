import { config } from '../../src/resources/scripts/config';

describe('registration', () => {
	describe('addiction', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.suchtberatung.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.suchtberatung.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('u25', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.u25.html?aid=1');
			cy.checkForGenericRegistrationElements();
		});

		it('should have a password reset info text', () => {
			cy.visit('/registration.u25.html?aid=1');
			cy.get('.registration__passwordNote').should('exist');
		});

		it('should have an agency info when aid is given', () => {
			cy.fixture('service.agencies.json').then((agencies) => {
				cy.intercept(config.endpoints.agencyServiceBase, agencies);
				cy.visit('/registration.u25.html?aid=1');
				cy.get('.registration__agencyInfo').should('exist');
				cy.get('.formWrapper__infoText').contains(agencies[0].name);
			});
		});
	});

	describe('pregnancy', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.schwangerschaftsberatung.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.schwangerschaftsberatung.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('parenting', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.eltern-familie.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.eltern-familie.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('cure', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.kurberatung.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.kurberatung.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('debt', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.schuldnerberatung.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.schuldnerberatung.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('social', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.allgemeine-soziale-beratung.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.allgemeine-soziale-beratung.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('seniority', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.leben-im-alter.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.leben-im-alter.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('disability', () => {
		it('should have all generic registration page elements', () => {
			cy.visit(
				'/registration.behinderung-und-psychische-erkrankung.html'
			);
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit(
				'/registration.behinderung-und-psychische-erkrankung.html'
			);
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('planB', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.mein-planb.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.mein-planb.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('law', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.rechtliche-betreuung.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.rechtliche-betreuung.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('offender', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.straffaelligkeit.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.straffaelligkeit.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('aids', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.hiv-aids-beratung.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.hiv-aids-beratung.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('rehabilitation', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.kinder-reha.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.kinder-reha.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('children', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.kinder-jugendliche.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.kinder-jugendliche.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('kreuzbund', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.kb-sucht-selbsthilfe.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.kb-sucht-selbsthilfe.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('migration', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.migration.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.migration.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('emigration', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.rw-auswanderung.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.rw-auswanderung.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('hospice', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.hospiz-palliativ.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.hospiz-palliativ.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('regional', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.regionale-angebote.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.regionale-angebote.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});

	describe('men', () => {
		it('should have all generic registration page elements', () => {
			cy.visit('/registration.jungen-und-maenner.html');
			cy.checkForGenericRegistrationElements();
		});

		it('should have no password reset info text', () => {
			cy.visit('/registration.jungen-und-maenner.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});
});

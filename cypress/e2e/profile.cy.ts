import { endpoints } from '../../src/resources/scripts/endpoints';
import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';
import { USER_CONSULTANT } from '../support/commands/login';

describe('profile', () => {
	before(() => {
		startWebSocketServer();
	});

	after(() => {
		closeWebSocketServer();
	});

	beforeEach(() => {
		cy.mockApi();
		mockWebSocket();
	});

	describe('asker', () => {
		it('can register for a new consulting type with an external agency', () => {
			cy.intercept(
				endpoints.agencyServiceBase +
					'?postcode=00000&consultingType=0',
				[
					{
						id: 1,
						name: 'Schwangerschaftsberatung Baden',
						postcode: '00000',
						city: 'Basen',
						description:
							'Beraterinnen der Schwangerschaftsberatung der Diakonie in Baden antworten auf Ihre Fragen und begleiten Sie online bei Ihren Überlegungen.',
						teamAgency: true,
						offline: false,
						consultingType: 1,
						external: true,
						url: 'https://www.onlineberatung-diakonie-baden.de/'
					}
				]
			);

			cy.fastLogin();

			cy.visit('/beratung-hilfe.html', {
				onBeforeLoad(window) {
					cy.stub(window, 'open').as('windowOpen');
				}
			});
			cy.contains('Profil').click();

			cy.get('#consultingTypeSelect').click();
			cy.get('.select__input__option:contains("Suchtberatung")').click();

			cy.get('[name="postcode"]').type('00000');
			cy.contains('Schwangerschaftsberatung Baden');
			cy.contains('Registrieren').click();
			cy.contains(
				'Ihre gewählte Beratungsstelle nutzt eine andere Anwendung für die Beratung'
			);
			cy.contains(
				'Möchten Sie für „Suchtberatung“ zu der anderen Anwendung wechseln und sich dort registrieren?'
			);

			cy.contains('Jetzt wechseln').click();
			cy.get('@windowOpen').should(
				'be.calledWith',
				'https://www.onlineberatung-diakonie-baden.de/',
				'_blank'
			);
		});

		it('can register for a new consulting type with an internal agency', () => {
			cy.intercept(
				endpoints.agencyServiceBase +
					'?postcode=00000&consultingType=0',
				[
					{
						id: 1,
						name: 'Schwangerschaftsberatung Baden',
						postcode: '00000',
						city: 'Basen',
						description:
							'Beraterinnen der Schwangerschaftsberatung der Diakonie in Baden antworten auf Ihre Fragen und begleiten Sie online bei Ihren Überlegungen.',
						teamAgency: true,
						offline: false,
						consultingType: 1,
						external: false
					}
				]
			);

			cy.intercept(endpoints.registerAskerNewConsultingType, {
				sessionId: 902,
				status: 'CREATED'
			});

			cy.fastLogin();

			cy.contains('Profil').click();

			cy.get('#consultingTypeSelect').click();
			cy.get('.select__input__option:contains("Suchtberatung")').click();

			cy.get('[name="postcode"]').type('00000');
			cy.contains('Schwangerschaftsberatung Baden');
			cy.contains('Registrieren').click();

			cy.contains(
				'Sie haben sich erfolgreich für ein neues Themenfeld registriert.'
			);
		});
	});

	describe('consultant absence', () => {
		beforeEach(() => {
			cy.fastLogin({
				username: USER_CONSULTANT
			});
		});

		it('activate and deactivate absence consultant', () => {
			cy.contains('Profil').should('exist').click();

			cy.contains('Meine Aktivitäten').click();
			cy.contains('Hinterlegen Sie eine Abwesenheitsnachricht');

			cy.willReturn('userData', {
				absent: true
			});
			cy.get('#absenceForm .mr--1').click();
			cy.get('.button__autoClose').click();
			cy.contains(
				'Deaktivieren Sie Ihre Abwesenheit, um eine Nachricht zu hinterlegen oder sie zu bearbeiten.'
			);
			cy.get('#absenceForm .generalInformation textarea').should(
				'be.disabled'
			);

			cy.willReturn('userData', {
				absent: false
			});

			cy.get('#absenceForm .mr--1').click();
			cy.get('.button__autoClose').click();
			cy.contains('Hinterlegen Sie eine Abwesenheitsnachricht');
			cy.get('#absenceForm .generalInformation textarea').should(
				'not.be.disabled'
			);
		});

		it('activate and deactivate absence consultant with message', () => {
			cy.contains('Profil').should('exist').click();

			cy.contains('Meine Aktivitäten').click();
			cy.contains('Hinterlegen Sie eine Abwesenheitsnachricht');

			cy.get('#absenceForm .generalInformation textarea')
				.type(
					'Liebe Ratsuchende, ich bin im Urlaub vom 23.05.2022 bis 05.06.2022.'
				)
				.get('#absenceForm .mr--1')
				.click();
			cy.get('.button__autoClose').click();
			cy.contains(
				'Deaktivieren Sie Ihre Abwesenheit, um eine Nachricht zu hinterlegen oder sie zu bearbeiten.'
			);
			cy.get('#absenceForm .generalInformation textarea').should(
				'be.disabled'
			);

			cy.get('#absenceForm .mr--1').click();
			cy.get('.button__autoClose').click();
			cy.contains('Hinterlegen Sie eine Abwesenheitsnachricht');
			cy.get('#absenceForm .generalInformation textarea').should(
				'not.be.disabled'
			);
		});
	});

	describe('consultant email notification', () => {
		beforeEach(() => {
			cy.fastLogin({
				username: USER_CONSULTANT
			});
		});

		it('deactivate and activate email notification consultant', () => {
			cy.contains('Profil').should('exist').click();
			cy.contains('Einstellungen').should('exist').click();
			cy.contains('E-Mail-Benachrichtigungen');
			cy.get('.notifications__content .mr--1 input').should(
				'have.attr',
				'aria-checked',
				'true'
			);

			cy.get('.notifications__content .mr--1').click();
			cy.get('.notifications__content .mr--1 input').should(
				'have.attr',
				'aria-checked',
				'false'
			);

			cy.get('.notifications__content .mr--1').click();
			cy.get('.notifications__content .mr--1 input').should(
				'have.attr',
				'aria-checked',
				'true'
			);
		});
	});
});

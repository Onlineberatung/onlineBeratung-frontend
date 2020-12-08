import attachmentsI18n from '../../src/resources/scripts/i18n/de/attachments';
import attachmentsInformalI18n from '../../src/resources/scripts/i18n/de/attachmentsInformal';

describe('Messages', () => {
	describe('Attachments', () => {
		it('should allow to send a message with attachment', () => {
			cy.caritasMockedLogin();

			cy.get('.sessionsList__itemsWrapper ').click();
			cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
			cy.get('.textarea__iconWrapper').click();

			cy.wait('@attachmentUpload');
		});

		describe('formal', () => {
			it('should show inline error when quota is reached', () => {
				cy.caritasMockedLogin({
					attachmentUpload: {
						statusCode: 403,
						headers: {
							'X-Reason': 'QUOTA_REACHED'
						}
					}
				});

				cy.get('.sessionsList__itemsWrapper ').click();
				cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
				cy.get('.textarea__iconWrapper').click();

				cy.wait('@attachmentUpload');

				cy.contains(attachmentsI18n['error.quota.headline']);
			});
		});

		describe('informal', () => {
			it('should show inline error when quota is reached', () => {
				cy.caritasMockedLogin({
					userData: {
						formalLanguage: false
					},
					attachmentUpload: {
						statusCode: 403,
						headers: {
							'X-Reason': 'QUOTA_REACHED'
						}
					}
				});

				cy.get('.sessionsList__itemsWrapper ').click();
				cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
				cy.get('.textarea__iconWrapper').click();

				cy.wait('@attachmentUpload');

				cy.contains(attachmentsInformalI18n['error.quota.headline']);
			});
		});
	});
});

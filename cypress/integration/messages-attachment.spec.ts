import attachmentsI18n from '../../src/resources/scripts/i18n/de/attachments';

describe('Messages Attachment', () => {
	it('should allow to send a message with attachment', () => {
		cy.caritasMockedLogin();

		cy.get('.sessionsList__itemsWrapper ').click();
		cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
		cy.get('.textarea__iconWrapper').click();

		cy.wait('@attachmentUpload');
	});

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

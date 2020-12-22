declare namespace MailService {
	namespace Schemas {
		export interface MailDTO {
			/**
			 * example:
			 * template
			 */
			template: string;
			/**
			 * example:
			 * max@mustermann.de
			 */
			email: string;
			templateData?: TemplateDataDTO[];
		}
		export interface MailsDTO {
			mails: MailDTO[];
		}
		export interface TemplateDataDTO {
			/**
			 * example:
			 * name
			 */
			key: string;
			value: string;
		}
	}
}
declare namespace Paths {
	namespace SendMails {
		export type RequestBody = MailService.Schemas.MailsDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $500 {}
		}
	}
}

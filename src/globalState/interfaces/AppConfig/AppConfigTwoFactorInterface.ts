export interface AppConfigTwoFactorInterface {
	startObligatoryHint: Date;
	dateTwoFactorObligatory: Date;
	messages: Array<{ title: string; copy: string; showClose: boolean }>;
}

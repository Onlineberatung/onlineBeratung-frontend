export const OVERLAY_REQUEST = 'request';
export const OVERLAY_E2EE = 'e2ee';
export const OVERLAY_RELEASE_NOTE = 'releaseNote';
export const OVERLAY_TWO_FACTOR_NAG = 'twoFactorNag';
export const OVERLAY_ABSENCE = 'absence';
export const OVERLAY_TERMS_AND_CONDITION = 'termsAndCondition';

export type OVERLAY_TYPES =
	| typeof OVERLAY_REQUEST
	| typeof OVERLAY_E2EE
	| typeof OVERLAY_RELEASE_NOTE
	| typeof OVERLAY_TWO_FACTOR_NAG
	| typeof OVERLAY_TERMS_AND_CONDITION
	| typeof OVERLAY_ABSENCE;

export interface OverlaysConfigInterface {
	priority?: OVERLAY_TYPES[];
}

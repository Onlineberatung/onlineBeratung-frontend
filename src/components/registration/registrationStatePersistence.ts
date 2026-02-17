/**
 * Utility for persisting registration form state across page navigation
 * Uses sessionStorage for temporary persistence during the session
 */

import { FormAccordionData } from './RegistrationForm';

const STORAGE_KEY = 'registration_form_state';
const STORAGE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export interface PersistedRegistrationState {
	formData: FormAccordionData;
	activeStep: number;
	visitedSteps: number[];
	isDataProtectionSelected: boolean;
	timestamp: number;
}

/**
 * Save registration state to sessionStorage
 */
export const saveRegistrationState = (
	formData: FormAccordionData,
	activeStep: number,
	visitedSteps: Set<number>,
	isDataProtectionSelected: boolean
): void => {
	try {
		const state: PersistedRegistrationState = {
			formData,
			activeStep,
			visitedSteps: Array.from(visitedSteps),
			isDataProtectionSelected,
			timestamp: Date.now()
		};
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (error) {
		console.warn('Failed to save registration state:', error);
	}
};

/**
 * Load registration state from sessionStorage
 * Returns null if no valid state exists
 */
export const loadRegistrationState = (): PersistedRegistrationState | null => {
	try {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return null;
		}

		const state: PersistedRegistrationState = JSON.parse(stored);
		
		// Check if state has expired
		if (Date.now() - state.timestamp > STORAGE_EXPIRY_MS) {
			clearRegistrationState();
			return null;
		}

		return state;
	} catch (error) {
		console.warn('Failed to load registration state:', error);
		clearRegistrationState();
		return null;
	}
};

/**
 * Clear registration state from sessionStorage
 */
export const clearRegistrationState = (): void => {
	try {
		sessionStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.warn('Failed to clear registration state:', error);
	}
};

/**
 * Check if there's a saved registration state
 */
export const hasRegistrationState = (): boolean => {
	try {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return false;
		}

		const state: PersistedRegistrationState = JSON.parse(stored);
		// Check if not expired
		return Date.now() - state.timestamp <= STORAGE_EXPIRY_MS;
	} catch (error) {
		return false;
	}
};

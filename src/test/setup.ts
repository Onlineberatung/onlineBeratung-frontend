import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
	cleanup();
});

// Mock import.meta.env
vi.stubGlobal('import.meta', {
	env: {
		VITE_CSRF_WHITELIST_HEADER_PROPERTY: 'X-CSRF-TOKEN',
		VITE_COOKIES_ALLOWEDLIST: ''
	}
});

// Mock window.dispatchEvent to avoid errors in requestCollector
const originalDispatchEvent = window.dispatchEvent;
window.dispatchEvent = function (event: Event) {
	try {
		return originalDispatchEvent.call(this, event);
	} catch {
		return true;
	}
};

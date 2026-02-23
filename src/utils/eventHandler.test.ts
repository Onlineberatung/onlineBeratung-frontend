import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	addEventListener,
	removeEventListener,
	getEventListeners,
	callEventListeners
} from './eventHandler';

// We need to clear the internal events array between tests
// Since events is module-level, we need to remove listeners manually
describe('eventHandler', () => {
	const createHandler = (returnValue?: any) =>
		vi.fn().mockResolvedValue(returnValue);

	describe('addEventListener', () => {
		it('should add an event listener', () => {
			const handler = createHandler();
			addEventListener('test-add', handler);
			const listeners = getEventListeners('test-add');
			expect(listeners.length).toBeGreaterThanOrEqual(1);
			expect(listeners.some((l) => l.handler === handler)).toBe(true);
			// Cleanup
			removeEventListener('test-add', handler);
		});

		it('should not add the same handler twice for the same event', () => {
			const handler = createHandler();
			addEventListener('test-dedupe', handler);
			addEventListener('test-dedupe', handler);
			const listeners = getEventListeners('test-dedupe');
			const matchingListeners = listeners.filter(
				(l) => l.handler === handler
			);
			expect(matchingListeners.length).toBe(1);
			// Cleanup
			removeEventListener('test-dedupe', handler);
		});
	});

	describe('removeEventListener', () => {
		it('should remove an existing event listener', () => {
			const handler = createHandler();
			addEventListener('test-remove', handler);
			removeEventListener('test-remove', handler);
			const listeners = getEventListeners('test-remove');
			expect(listeners.some((l) => l.handler === handler)).toBe(false);
		});

		it('should not throw when removing a non-existent listener', () => {
			const handler = createHandler();
			expect(() =>
				removeEventListener('non-existent', handler)
			).not.toThrow();
		});
	});

	describe('getEventListeners', () => {
		it('should return empty array for unknown event', () => {
			const listeners = getEventListeners('unknown-event-xyz');
			expect(listeners).toEqual([]);
		});

		it('should return only listeners for the specified event', () => {
			const handler1 = createHandler();
			const handler2 = createHandler();
			addEventListener('event-a-filter', handler1);
			addEventListener('event-b-filter', handler2);

			const listenersA = getEventListeners('event-a-filter');
			expect(listenersA.some((l) => l.handler === handler1)).toBe(true);
			expect(listenersA.some((l) => l.handler === handler2)).toBe(false);

			// Cleanup
			removeEventListener('event-a-filter', handler1);
			removeEventListener('event-b-filter', handler2);
		});
	});

	describe('callEventListeners', () => {
		it('should return args directly if no listeners exist', () => {
			const result = callEventListeners('no-listeners', { data: 'test' });
			expect(result).toEqual({ data: 'test' });
		});

		it('should call a single listener with the provided args', async () => {
			const handler = vi.fn().mockResolvedValue('result');
			addEventListener('test-call-single', handler);

			const result = await callEventListeners('test-call-single', 'input');
			expect(handler).toHaveBeenCalledWith('input');
			expect(result).toBe('result');

			// Cleanup - handler was already popped by callEventListeners
		});

		it('should chain multiple listeners', async () => {
			const handler1 = vi.fn().mockResolvedValue('step1');
			const handler2 = vi.fn().mockResolvedValue('step2');
			addEventListener('test-chain', handler1);
			addEventListener('test-chain', handler2);

			const result = await callEventListeners('test-chain', 'initial');
			// Handlers are popped (LIFO), so handler2 is called first
			expect(result).toBe('step1');
			// Listeners were consumed by the calls (popped), no cleanup needed
		});
	});
});

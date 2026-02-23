import { describe, it, expect } from 'vitest';
import {
	isTabGroup,
	solveCondition,
	solveGroupConditions,
	solveTabConditions,
	TabType,
	TabGroups,
	SingleComponentType
} from './tabsHelper';

describe('tabsHelper', () => {
	describe('isTabGroup', () => {
		it('should return true if item has elements property', () => {
			const group: TabGroups = {
				title: 'Group',
				url: '/group',
				elements: []
			};
			expect(isTabGroup(group)).toBe(true);
		});

		it('should return false if item does not have elements property', () => {
			const component: SingleComponentType = {
				component: 'TestComponent'
			};
			expect(isTabGroup(component)).toBe(false);
		});
	});

	describe('solveCondition', () => {
		it('should return true when condition is undefined', () => {
			expect(solveCondition(undefined)).toBe(true);
		});

		it('should return true when condition is null', () => {
			expect(solveCondition(null)).toBe(true);
		});

		it('should return the result of the condition function', () => {
			expect(solveCondition(() => true)).toBe(true);
			expect(solveCondition(() => false)).toBe(false);
		});

		it('should pass params to the condition function', () => {
			const condition = (a: number, b: number) => a > b;
			expect(solveCondition(condition, 5, 3)).toBe(true);
			expect(solveCondition(condition, 3, 5)).toBe(false);
		});
	});

	describe('solveGroupConditions', () => {
		it('should return true for a component with no condition', () => {
			const component: SingleComponentType = {
				component: 'TestComponent'
			};
			expect(solveGroupConditions(component)).toBe(true);
		});

		it('should return false for a component with a failing condition', () => {
			const component: SingleComponentType = {
				component: 'TestComponent',
				condition: () => false
			};
			expect(solveGroupConditions(component)).toBe(false);
		});

		it('should check sub-element conditions for tab groups', () => {
			const group: TabGroups = {
				title: 'Group',
				url: '/group',
				elements: [
					{ component: 'A', condition: () => false },
					{ component: 'B', condition: () => true }
				]
			};
			expect(solveGroupConditions(group)).toBe(true);
		});

		it('should return false if group condition fails even if children pass', () => {
			const group: TabGroups = {
				title: 'Group',
				url: '/group',
				condition: () => false,
				elements: [{ component: 'A', condition: () => true }]
			};
			expect(solveGroupConditions(group)).toBe(false);
		});

		it('should return false if group passes but all children fail', () => {
			const group: TabGroups = {
				title: 'Group',
				url: '/group',
				condition: () => true,
				elements: [
					{ component: 'A', condition: () => false },
					{ component: 'B', condition: () => false }
				]
			};
			expect(solveGroupConditions(group)).toBe(false);
		});
	});

	describe('solveTabConditions', () => {
		it('should return true for tab with no conditions and passing elements', () => {
			const tab: TabType = {
				title: 'Tab',
				url: '/tab',
				elements: [{ component: 'A' }]
			};
			expect(solveTabConditions(tab)).toBe(true);
		});

		it('should return false for tab with failing condition', () => {
			const tab: TabType = {
				title: 'Tab',
				url: '/tab',
				condition: () => false,
				elements: [{ component: 'A' }]
			};
			expect(solveTabConditions(tab)).toBe(false);
		});

		it('should return false if all elements fail their conditions', () => {
			const tab: TabType = {
				title: 'Tab',
				url: '/tab',
				elements: [
					{ component: 'A', condition: () => false },
					{ component: 'B', condition: () => false }
				]
			};
			expect(solveTabConditions(tab)).toBe(false);
		});

		it('should return true if at least one element passes', () => {
			const tab: TabType = {
				title: 'Tab',
				url: '/tab',
				elements: [
					{ component: 'A', condition: () => false },
					{ component: 'B', condition: () => true }
				]
			};
			expect(solveTabConditions(tab)).toBe(true);
		});
	});
});

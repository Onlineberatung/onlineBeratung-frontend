import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckboxMui } from './CheckboxMui';

describe('CheckboxMui', () => {
	const defaultProps = {
		inputId: 'test-checkbox',
		name: 'testCheckbox',
		labelId: 'test-label',
		label: 'Test Label',
		checked: false,
		checkboxHandle: vi.fn()
	};

	it('should render with a label', () => {
		render(<CheckboxMui {...defaultProps} />);
		expect(screen.getByText('Test Label')).toBeInTheDocument();
	});

	it('should render unchecked by default', () => {
		render(<CheckboxMui {...defaultProps} />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).not.toBeChecked();
	});

	it('should render checked when checked prop is true', () => {
		render(<CheckboxMui {...defaultProps} checked={true} />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeChecked();
	});

	it('should call checkboxHandle when clicked', () => {
		const handleChange = vi.fn();
		render(
			<CheckboxMui {...defaultProps} checkboxHandle={handleChange} />
		);
		const checkbox = screen.getByRole('checkbox');
		fireEvent.click(checkbox);
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('should render with description', () => {
		const { container } = render(
			<CheckboxMui {...defaultProps} description="Additional details" />
		);
		// Description is rendered inside the same span as the label, separated by <br>
		expect(container.textContent).toContain('Additional details');
	});

	it('should render children when no label is provided', () => {
		render(
			<CheckboxMui {...defaultProps} label={undefined}>
				<span>Custom child content</span>
			</CheckboxMui>
		);
		expect(screen.getByText('Custom child content')).toBeInTheDocument();
	});

	it('should have the correct name attribute', () => {
		render(<CheckboxMui {...defaultProps} />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('name', 'testCheckbox');
	});
});

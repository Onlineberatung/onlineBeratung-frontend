import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from './InputField';

// Mock react-i18next
vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key
	})
}));

describe('InputField', () => {
	const defaultItem = {
		id: 'test-input',
		type: 'text',
		name: 'testField',
		label: 'Test Label',
		content: ''
	};

	it('should render with a label', () => {
		render(
			<InputField item={defaultItem} inputHandle={vi.fn()} />
		);
		expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
	});

	it('should render with the correct placeholder', () => {
		render(
			<InputField item={defaultItem} inputHandle={vi.fn()} />
		);
		expect(
			screen.getByPlaceholderText('Test Label')
		).toBeInTheDocument();
	});

	it('should display the content value', () => {
		render(
			<InputField
				item={{ ...defaultItem, content: 'Hello World' }}
				inputHandle={vi.fn()}
			/>
		);
		expect(screen.getByDisplayValue('Hello World')).toBeInTheDocument();
	});

	it('should call inputHandle on text input change', () => {
		const handleInput = vi.fn();
		render(
			<InputField item={defaultItem} inputHandle={handleInput} />
		);
		const input = screen.getByPlaceholderText('Test Label');
		fireEvent.change(input, { target: { value: 'new value' } });
		expect(handleInput).toHaveBeenCalled();
	});

	it('should render disabled when disabled is true', () => {
		render(
			<InputField
				item={{ ...defaultItem, disabled: true }}
				inputHandle={vi.fn()}
			/>
		);
		const input = screen.getByPlaceholderText('Test Label');
		expect(input).toBeDisabled();
	});

	it('should show password toggle for password fields', () => {
		render(
			<InputField
				item={{ ...defaultItem, type: 'password' }}
				inputHandle={vi.fn()}
			/>
		);
		// Should have a visibility icon
		expect(
			screen.getByLabelText('login.password.show')
		).toBeInTheDocument();
	});

	it('should toggle password visibility when clicking the toggle', () => {
		render(
			<InputField
				item={{ ...defaultItem, type: 'password', content: 'secret' }}
				inputHandle={vi.fn()}
			/>
		);
		const input = screen.getByPlaceholderText('Test Label');
		expect(input).toHaveAttribute('type', 'password');

		// Click the show password toggle
		const toggle = screen.getByLabelText('login.password.show');
		fireEvent.click(toggle.closest('.inputField__passwordToggle')!);

		// Now the input should be of type text
		expect(input).toHaveAttribute('type', 'text');
	});

	it('should render info text when provided', () => {
		render(
			<InputField
				item={{ ...defaultItem, infoText: 'Some info' }}
				inputHandle={vi.fn()}
			/>
		);
		expect(screen.getByText('Some info')).toBeInTheDocument();
	});

	it('should call keyUpHandle on key up', () => {
		const keyUpHandle = vi.fn();
		render(
			<InputField
				item={defaultItem}
				inputHandle={vi.fn()}
				keyUpHandle={keyUpHandle}
			/>
		);
		const input = screen.getByPlaceholderText('Test Label');
		fireEvent.keyUp(input, { key: 'a' });
		expect(keyUpHandle).toHaveBeenCalled();
	});

	it('should validate input with maxLength', () => {
		const handleInput = vi.fn();
		render(
			<InputField
				item={{ ...defaultItem, maxLength: 5 }}
				inputHandle={handleInput}
			/>
		);
		const input = screen.getByPlaceholderText('Test Label');

		// Input within maxLength should call handler
		fireEvent.change(input, { target: { value: '12345' } });
		expect(handleInput).toHaveBeenCalled();

		// Input exceeding maxLength should not call handler
		handleInput.mockClear();
		fireEvent.change(input, { target: { value: '123456' } });
		expect(handleInput).not.toHaveBeenCalled();
	});

	it('should validate input with pattern', () => {
		const handleInput = vi.fn();
		render(
			<InputField
				item={{ ...defaultItem, pattern: '^[0-9]+$' }}
				inputHandle={handleInput}
			/>
		);
		const input = screen.getByPlaceholderText('Test Label');

		// Valid pattern input
		fireEvent.change(input, { target: { value: '123' } });
		expect(handleInput).toHaveBeenCalled();

		// Invalid pattern input
		handleInput.mockClear();
		fireEvent.change(input, { target: { value: 'abc' } });
		expect(handleInput).not.toHaveBeenCalled();
	});

	it('should apply valid label state class', () => {
		render(
			<InputField
				item={{ ...defaultItem, labelState: 'valid' }}
				inputHandle={vi.fn()}
			/>
		);
		const input = screen.getByPlaceholderText('Test Label');
		expect(input.className).toContain('inputField__input--valid');
	});

	it('should apply invalid label state class', () => {
		render(
			<InputField
				item={{ ...defaultItem, labelState: 'invalid' }}
				inputHandle={vi.fn()}
			/>
		);
		const input = screen.getByPlaceholderText('Test Label');
		expect(input.className).toContain('inputField__input--invalid');
	});
});

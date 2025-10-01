import { Field } from 'rc-field-form';
import React from 'react';
import type { Rule } from 'rc-field-form/es/interface';
import { FieldProps } from 'rc-field-form/es/Field';

interface InputProps {
	name?: string;
	min?: number;
	max?: number;
	placeholder?: string;
	normalize?: FieldProps['normalize'];
	type?: string;
	rule?: Rule;
	tabIndex?: number;
	autoFocus?: boolean;
}

export const InputFormField = ({
	type = 'text',
	name,
	placeholder,
	normalize,
	rule,
	...rest
}: InputProps) => {
	return (
		<Field
			name={name}
			rules={[{ required: true, ...(rule || {}) }]}
			normalize={normalize}
		>
			{({ value, ...props }) => (
				<input
					className="registrationFormDigi__Input"
					type={type}
					placeholder={placeholder}
					value={value || ''}
					{...rest}
					{...props}
				/>
			)}
		</Field>
	);
};

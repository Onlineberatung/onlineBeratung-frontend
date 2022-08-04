import { Field } from 'rc-field-form';
import React from 'react';

interface InputProps {
	name?: string;
	min?: number;
	max?: number;
	placeholder?: string;
	type?: string;
	pattern?: RegExp;
}

const LocalInput = ({
	value,
	type,
	...rest
}: {
	type?: string;
	value?: string;
	placeholder?: string;
}) => (
	<input
		className="registrationFormDigi__Input"
		type={type}
		value={value || ''}
		{...rest}
	/>
);

export const InputFormField = ({
	type = 'text',
	name,
	placeholder,
	pattern,
	...rest
}: InputProps) => {
	const patternRules = pattern ? { pattern } : {};
	return (
		<Field name={name} rules={[{ required: true, ...patternRules }]}>
			<LocalInput type={type} placeholder={placeholder} {...rest} />
		</Field>
	);
};

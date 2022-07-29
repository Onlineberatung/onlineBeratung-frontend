import { Field } from 'rc-field-form';
import React from 'react';

interface InputProps {
	name?: string;
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
	pattern
}: InputProps) => {
	return (
		<Field name={name} rules={[{ required: true, pattern }]}>
			<LocalInput type={type} />
		</Field>
	);
};

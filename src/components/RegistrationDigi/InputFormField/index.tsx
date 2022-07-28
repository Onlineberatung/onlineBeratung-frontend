import { Field } from 'rc-field-form';
import React from 'react';

interface InputProps {
	name?: string;
	type?: string;
	pattern?: RegExp;
}

export const InputFormField = ({
	type = 'text',
	name,
	pattern
}: InputProps) => {
	return (
		<Field name={name} rules={[{ required: true, pattern }]}>
			<input className="registrationFormDigi__Input" type={type} />
		</Field>
	);
};

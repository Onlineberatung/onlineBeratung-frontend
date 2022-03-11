import * as React from 'react';
import { TextareaHTMLAttributes, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import './textarea.styles';

export interface TextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = (props: TextareaProps) => {
	const { onChange, placeholder, id: customId, ...attrs } = props;

	const id = customId ?? uuid();

	const handleChange = useCallback(
		(e) => {
			if (onChange) {
				onChange(e);
			}
		},
		[onChange]
	);

	return (
		<div className="textarea__wrapper">
			<div className="textarea">
				<textarea
					onChange={handleChange}
					id={id}
					{...attrs}
					placeholder={placeholder}
				/>
				{placeholder && <label htmlFor={id}>{placeholder}</label>}
			</div>
		</div>
	);
};

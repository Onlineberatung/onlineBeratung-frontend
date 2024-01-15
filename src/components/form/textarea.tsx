import * as React from 'react';
import { TextareaHTMLAttributes, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import './textarea.styles';
import useMeasure from 'react-use-measure';
import { ResizeObserver } from '@juggle/resize-observer';

export interface TextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = ({
	onChange,
	placeholder,
	id: customId,
	...attrs
}: TextareaProps) => {
	const id = customId ?? uuid();
	const [labelRef, labelBounds] = useMeasure({ polyfill: ResizeObserver });

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
					style={{ paddingTop: labelBounds.height + 8 + 'px' }}
				/>
				{placeholder && (
					<label htmlFor={id} ref={labelRef}>
						{placeholder}
					</label>
				)}
				{attrs.maxLength && (
					<div className="textarea__letters">
						{(attrs?.value?.toString() ?? '').length} /{' '}
						{attrs.maxLength}
					</div>
				)}
			</div>
		</div>
	);
};

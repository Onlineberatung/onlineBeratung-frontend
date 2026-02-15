import * as React from 'react';
import { TextareaHTMLAttributes } from 'react';
import { TextField } from '@mui/material';
import './textareaMui.styles.scss';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextareaMui = ({
	onChange,
	placeholder,
	id,
	maxLength,
	value,
	...attrs
}: TextareaProps) => {
	const characterCount = value?.toString().length || 0;
	const showCounter = maxLength !== undefined;

	return (
		<div className="textareaMui__wrapper">
			<TextField
				id={id}
				label={placeholder}
				multiline
				rows={4}
				value={value}
				onChange={onChange as any}
				inputProps={{
					maxLength: maxLength,
					...attrs
				}}
				fullWidth
				variant="outlined"
			/>
			{showCounter && (
				<div className="textareaMui__counter">
					{characterCount} / {maxLength}
				</div>
			)}
		</div>
	);
};

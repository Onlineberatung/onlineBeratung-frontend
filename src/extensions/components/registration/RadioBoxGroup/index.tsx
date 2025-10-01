import React, { FC } from 'react';
import { Field } from 'rc-field-form';
import { RadioButton } from '../../../../components/radioButton/RadioButton';
import { NamePath } from 'rc-field-form/es/interface';
import classNames from 'classnames';

interface RadioBoxGroupProps {
	name: string;
	options: Array<{ label: string; value: string }>;
	preset?: string;
	dependencies?: NamePath[];
	normalize?: (value: string) => any;
}

export const RadioBoxGroup: FC<RadioBoxGroupProps> = ({
	name,
	dependencies,
	options,
	preset,
	normalize,
	children,
	...props
}) => {
	return (
		<Field
			name={name}
			rules={[{ required: true }]}
			dependencies={dependencies}
			initialValue={preset}
			normalize={normalize}
		>
			{({ value, onChange }) =>
				options.map(({ value: valueRadio, label }, i) => {
					const inputId = `radio-${valueRadio}`;
					return (
						<RadioButton
							key={inputId}
							className={classNames({
								last: i === options.length - 1
							})}
							checked={`${value}` === `${valueRadio}`}
							name={name}
							inputId={inputId}
							value={valueRadio}
							handleRadioButton={onChange}
							type="default"
							{...props}
						>
							{label}
						</RadioButton>
					);
				})
			}
		</Field>
	);
};

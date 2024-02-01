import React from 'react';
import { Field } from 'rc-field-form';
import {
	RadioButton,
	RadioButtonItem
} from '../../../../components/radioButton/RadioButton';
import { NamePath } from 'rc-field-form/es/interface';

interface RadioBoxGroupProps {
	name: string | number | any;
	options: Array<{ label: string; value: string }>;
	preset?: string;
}

const RadioBox = ({
	last,
	value,
	onChange,
	valueRadio,
	...item
}: {
	value?: string;
	onChange?: (value: string) => void;
	valueRadio: string;
	last?: boolean;
} & Omit<
	RadioButtonItem,
	'handleRadioButton' | 'checked' | 'type' | 'value' | 'inputId'
>) => {
	const inputId = `radio-${valueRadio}`;
	return (
		<RadioButton
			className={last ? 'last' : ''}
			checked={`${value}` === `${valueRadio}`}
			{...item}
			inputId={inputId}
			value={valueRadio}
			handleRadioButton={onChange}
			type="default"
		/>
	);
};

const LocalRadioBox = ({
	options,
	...rest
}: RadioBoxGroupProps & {
	value?: string;
	onChange?: (value: string) => void;
}) => {
	return (
		<>
			{options.map(({ value, label }, i) => (
				<RadioBox
					label={label}
					valueRadio={value}
					{...rest}
					last={i === options.length - 1}
					key={value}
				/>
			))}
		</>
	);
};
export const RadioBoxGroup = ({
	name,
	dependencies,
	...props
}: RadioBoxGroupProps & { dependencies?: NamePath[] }) => {
	return (
		<Field
			name={name}
			rules={[{ required: true }]}
			dependencies={dependencies}
			initialValue={props.preset}
		>
			<LocalRadioBox {...props} name={name} />
		</Field>
	);
};

import { Field } from 'rc-field-form';
import React from 'react';
import { RegistrationUsername } from '../../registration/RegistrationUsername';

const LocalPassword = ({
	value,
	onChange,
	isInUse
}: {
	isInUse?: boolean;
	onChange?: (value: string) => void;
	value?: string;
}) => (
	<RegistrationUsername
		isUsernameAlreadyInUse={isInUse}
		onUsernameChange={(username) => {
			if (value !== username) {
				onChange(username || '');
			}
		}}
		onValidityChange={() => null}
	/>
);

export const UsernameFormField = ({ inInUse }: { inInUse: boolean }) => {
	return (
		<Field name="username" rules={[{ required: true, min: 5 }]}>
			<LocalPassword isInUse={inInUse} />
		</Field>
	);
};

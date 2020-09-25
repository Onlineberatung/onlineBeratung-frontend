import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../../stage/ts/stage';

export const initRegistration = () => {
	ReactDOM.render(
		<Registration />,
		document.getElementById('registrationRoot')
	);
};

const Registration = () => {
	const getConsultingTypeFromRegistrationX = () =>
		document.getElementById('registrationRoot')
			? parseInt(
					document.getElementById('registrationRoot').dataset
						.consultingtype
			  )
			: null;
	return (
		<>
			<Stage />
			<>
				<h1>Test Headline</h1>
				<p>{getConsultingTypeFromRegistrationX()}</p>
			</>
		</>
	);
};

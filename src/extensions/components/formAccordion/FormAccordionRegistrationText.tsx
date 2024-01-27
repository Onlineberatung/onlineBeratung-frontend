import { setValueInCookie } from '../../../components/sessionCookie/accessSessionCookie';
import { AgencyDataInterface } from '../../../globalState/interfaces';
import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './formAccordionRegistrationText.styles';

interface FormAccordionRegistrationTextProps {
	agency: AgencyDataInterface;
}

export const FormAccordionRegistrationText = (
	props: FormAccordionRegistrationTextProps
) => {
	const { t: translate } = useTranslation();

	useEffect(() => {
		props?.agency?.tenantId &&
			setValueInCookie(
				'tenantId',
				props?.agency?.tenantId?.toString() || '0'
			);
	}, [props.agency]);

	return (
		<p>
			{translate('registration.tsys.prefix')}
			<span>
				<button
					type="button"
					className="button-as-link-registration"
					onClick={() =>
						window.open(`${window.location.origin}/datenschutz`)
					}
				>
					{translate('registration.tsys.button')}
				</button>
			</span>
			{translate('registration.tsys.sufix')}
		</p>
	);
};

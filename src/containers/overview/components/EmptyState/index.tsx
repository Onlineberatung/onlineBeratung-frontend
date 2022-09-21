import React, { useMemo } from 'react';
import { ReactComponent as CheckmarkIcon } from '../../../../resources/img/illustrations/checkmark.svg';
import { ReactComponent as MailIcon } from '../../../../resources/img/illustrations/mail-icon.svg';
import { ReactComponent as TermineIcon } from '../../../../resources/img/illustrations/termine-icon.svg';
import { translate } from '../../../../utils/translate';
import './emptyState.styles.scss';

export enum EmptyType {
	Checkmark = 'checkmark',
	MailIcon = 'mail',
	Termine = 'termine'
}

export const EmptyState = ({ type }: { type: EmptyType }) => {
	const [Icon, message] = useMemo(() => {
		switch (type) {
			case EmptyType.Checkmark:
				return [CheckmarkIcon, translate('overview.myMessagesEmpty')];
			case EmptyType.MailIcon:
				return [MailIcon, translate('overview.myMessagesEmpty')];
			case EmptyType.Termine:
				return [TermineIcon, translate('overview.appointmentsEmpty')];
		}
	}, [type]);

	return (
		<div className="overviewEmptyState">
			<div className={`overviewEmptyState__icon ${type}`}>
				<Icon />
			</div>

			<span className="overviewEmptyState__message">{message}</span>
		</div>
	);
};

import * as React from 'react';
import './statusPage.styles.scss';
import { useTranslation } from 'react-i18next';

type TStatusPageProps = {
	closed: boolean;
};

const StatusPage = ({ closed }: TStatusPageProps) => {
	const { t: translate } = useTranslation();

	return (
		<div className="statusPage">
			{closed ? (
				<>
					<h1>{translate('videoCall.statusPage.closed.title')}</h1>
					<p>{translate('videoCall.statusPage.closed.action')}</p>
				</>
			) : (
				<>
					<h1>
						{translate('videoCall.statusPage.unauthorized.title')}
					</h1>
					<h3>
						{translate('videoCall.statusPage.unauthorized.reason')}
					</h3>
					<p>
						{translate('videoCall.statusPage.unauthorized.action')}
					</p>
				</>
			)}
		</div>
	);
};

export default StatusPage;

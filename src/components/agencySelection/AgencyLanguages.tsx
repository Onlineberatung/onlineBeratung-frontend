import React, { useState } from 'react';
import { translate } from '../../utils/translate';
import './agencyLanguages.styles';

interface AgencyLanguagesProps {
	languages: string[];
}

export const AgencyLanguages: React.FC<AgencyLanguagesProps> = ({
	languages
}) => {
	const [isAllShown, setIsAllShown] = useState(false);

	const languagesSelection = languages.slice(0, 2);
	const difference = languages.length - languagesSelection.length;

	const mapLanguages = (isoCode) => (
		<span key={isoCode}>
			{translate(`languages.${isoCode}`)} ({isoCode.toUpperCase()})
		</span>
	);

	return (
		<div className="agencyLanguages">
			<p>{translate('registration.agencySelection.languages.info')}</p>
			{isAllShown || difference <= 1 ? (
				<div>{languages.map(mapLanguages)}</div>
			) : (
				<div>
					{languagesSelection.map(mapLanguages)}
					<span
						className="agencyLanguages__more"
						onClick={() => {
							setIsAllShown(true);
						}}
					>
						+{difference}{' '}
						{translate(
							'registration.agencySelection.languages.more'
						)}
					</span>
				</div>
			)}
		</div>
	);
};

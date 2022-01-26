import React, { useEffect, useState } from 'react';
import { apiAgencyLanguages } from '../../api/apiAgencyLanguages';
import { translate } from '../../utils/translate';
import './agencyLanguages.styles';

interface AgencyLanguagesProps {
	agencyId: number;
}

export const AgencyLanguages: React.FC<AgencyLanguagesProps> = ({
	agencyId
}) => {
	const [isAllShown, setIsAllShown] = useState(false);
	const [languages, setLanguages] = useState<string[]>([]);

	useEffect(() => {
		// async wrapper
		const getLanguagesFromApi = async () => {
			// TODO REMOVE
			setLanguages(['de', 'en', 'zh', 'it', 'ar']);

			const response = await apiAgencyLanguages(agencyId).catch(
				(error) => {
					// TODO error handling
				}
			);

			if (response) {
				setLanguages(response.languages);
			}
		};

		getLanguagesFromApi();
	}, [agencyId]);

	const languagesSelection = languages.slice(0, 2);
	const difference = languages.length - languagesSelection.length;

	const mapLanguages = (isoCode) => (
		<span key={isoCode}>
			{translate(`languages.${isoCode}`)} ({isoCode.toUpperCase()})
		</span>
	);

	if (languages.length > 0) {
		return (
			<div className="agencyLanguages">
				<p>
					{translate('registration.agencySelection.languages.info')}
				</p>
				{isAllShown || difference < 1 ? (
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
							{`+${difference} ${translate(
								'registration.agencySelection.languages.more'
							)}`}
						</span>
					</div>
				)}
			</div>
		);
	} else {
		return <></>;
	}
};

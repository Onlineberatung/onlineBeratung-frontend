import * as React from 'react';
import { useContext } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../resources/scripts/i18n/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

export const ConsultantPublicData = () => {
	const { userData } = useContext(UserDataContext);

	return (
		<div>
			<div className="profile__content__title">
				<Headline
					text={translate('profile.data.title.private')}
					semanticLevel="5"
				/>
				<Text
					text={translate('profile.data.info.private')}
					type="infoLargeAlternative"
				/>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.userName')}
				</p>
				<p className="profile__data__content">{userData.userName}</p>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.agency')}
				</p>
				{userData.agencies.map((item, i) => {
					return (
						<p className="profile__data__content" key={i}>
							{item.name}
						</p>
					);
				})}
			</div>
		</div>
	);
};

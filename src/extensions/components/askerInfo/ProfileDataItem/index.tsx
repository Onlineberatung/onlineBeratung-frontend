import React from 'react';
import { useTranslation } from 'react-i18next';

interface ProfileDataItemProps {
	title: string;
	content: string;
}

export const ProfileDataItem = ({ title, content }: ProfileDataItemProps) => {
	const { t: translate } = useTranslation();
	return (
		<div className="profile__data__item">
			<p className="profile__data__label">{translate(title)}</p>
			<p className="profile__data__content">{content}</p>
		</div>
	);
};

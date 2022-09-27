import React from 'react';
import { translate } from '../../../utils/translate';

interface ProfileDataItemProps {
	title: string;
	content: string;
}

export const ProfileDataItem = ({ title, content }: ProfileDataItemProps) => (
	<div className="profile__data__item">
		<p className="profile__data__label">{translate(title)}</p>
		<p className="profile__data__content">{content}</p>
	</div>
);

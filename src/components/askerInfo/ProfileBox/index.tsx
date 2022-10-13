import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '../../box/Box';

interface ProfileBoxProps {
	title: string;
	children: React.ReactNode;
}

export const ProfileBox = ({ title, children }: ProfileBoxProps) => {
	const { t: translate } = useTranslation();
	return (
		<div className="profile__innerWrapper askerInfo__contentDigi">
			<div className="profile__content askerInfo__content">
				<Box title={translate(title)}>{children}</Box>
			</div>
		</div>
	);
};

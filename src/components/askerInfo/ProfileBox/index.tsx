import React from 'react';
import { translate } from '../../../utils/translate';
import { Box } from '../../box/Box';

interface ProfileBoxProps {
	title: string;
	children: React.ReactNode;
}

export const ProfileBox = ({ title, children }: ProfileBoxProps) => (
	<div className="profile__innerWrapper askerInfo__contentDigi">
		<div className="profile__content askerInfo__content">
			<Box title={translate(title)}>{children}</Box>
		</div>
	</div>
);

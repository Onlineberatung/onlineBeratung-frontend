import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '../../../../components/box/Box';
import './styles';

interface ProfileBoxProps {
	title: string;
	children: React.ReactNode;
}

export const ProfileBox = ({ title, children }: ProfileBoxProps) => {
	const { t: translate } = useTranslation();
	return (
		<div className="profilebox">
			<div className="profilebox__content">
				<Box title={translate(title)}>{children}</Box>
			</div>
		</div>
	);
};

import React from 'react';
import { ReactNode } from 'react';

type ScrollableSectionHeaderProps = {
	children: ReactNode;
};

export const ScrollableSectionHeader = ({
	children
}: ScrollableSectionHeaderProps) => {
	return <>{children}</>;
};

import React from 'react';
import { ReactNode } from 'react';

type ScrollableSectionFooterProps = {
	children: ReactNode;
};

export const ScrollableSectionFooter = ({
	children
}: ScrollableSectionFooterProps) => {
	return <>{children}</>;
};

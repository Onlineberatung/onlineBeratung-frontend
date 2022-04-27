import React from 'react';
import { ReactNode } from 'react';

type ScrollableSectionBodyProps = {
	children: ReactNode;
};

export const ScrollableSectionBody = ({
	children
}: ScrollableSectionBodyProps) => {
	return <>{children}</>;
};

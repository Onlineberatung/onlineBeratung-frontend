import React, { ReactElement } from 'react';
import './scrollableSection.styles.scss';

type ScrollableSectionProps = {
	children: ReactElement[];
	offset?: number;
};

export const ScrollableSection = ({ children }: ScrollableSectionProps) => {
	return (
		<div className="scrollableSection">
			{children.length >= 2 && (
				<div className="scrollableSection__header">{children[0]}</div>
			)}
			<div className="scrollableSection__body">
				{children.length === 1 ? children[0] : children[1]}
			</div>
			{children.length === 3 && (
				<div className="scrollableSection__footer">{children[2]}</div>
			)}
		</div>
	);
};

import * as React from 'react';
import { ReactNode } from 'react';
import './box.styles';

type BoxProps = {
	title?: string;
	children: ReactNode;
};

export const Box = ({ children, title }: BoxProps) => {
	return (
		<div className="box">
			{title && <div className="box__title">{title}</div>}
			<div className="box__content">{children}</div>
		</div>
	);
};

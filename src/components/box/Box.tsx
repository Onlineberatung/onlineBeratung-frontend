import * as React from 'react';
import { ReactNode } from 'react';
import './box.styles';

type BoxProps = {
	children: ReactNode;
};

export const Box = ({ children }: BoxProps) => {
	return (
		<div className="box">
			<div className="box__content">{children}</div>
		</div>
	);
};

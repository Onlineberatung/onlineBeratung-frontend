import React from 'react';
import { Card as MuiCard, CardContent as MuiCardContent } from '@mui/material';
import './cardMui.styles.scss';

export interface CardProps {
	className?: string;
	children: React.ReactNode | React.ReactNode[];
}

export const CardMui = ({ className, children }: CardProps) => (
	<MuiCard className={`card-mui ${className || ''}`} elevation={0}>
		{children}
	</MuiCard>
);

const CardHeader = ({ className, children }: CardProps) => (
	<div className={`card-mui__header ${className || ''}`}>{children}</div>
);

const CardContent = ({ className, children }: CardProps) => (
	<MuiCardContent className={`card-mui__content ${className || ''}`}>
		{children}
	</MuiCardContent>
);

const CardFooter = ({ className, children }: CardProps) => (
	<div className={`card-mui__footer ${className || ''}`}>{children}</div>
);

CardMui.Header = CardHeader;
CardMui.Content = CardContent;
CardMui.Footer = CardFooter;

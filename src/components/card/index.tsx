import React from 'react';
import './card.styles.scss';

export interface CardProps {
	className?: string;
	children: React.ReactNode | React.ReactNode[];
}

export const Card = ({ className, children }: CardProps) => (
	<div className={`card ${className || ''}`}>{children}</div>
);

const CardHeader = ({ className, children }: CardProps) => (
	<div className={`card__header ${className || ''}`}>{children}</div>
);

const CardContent = ({ className, children }: CardProps) => (
	<div className={`card__content ${className || ''}`}>{children}</div>
);

const CardFooter = ({ className, children }: CardProps) => (
	<div className={`card__footer ${className || ''}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

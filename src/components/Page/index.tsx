import React from 'react';
import './page.styles.scss';

interface PageProps {
	className?: string;
	children: React.ReactChild | React.ReactChild[];
}

export const Page = ({ className, children }: PageProps) => (
	<div className={`page ${className || ''}`}>{children}</div>
);

export const PageTitle = ({ className, children }: PageProps) => (
	<div className={`page__title ${className || ''}`}>{children}</div>
);

Page.Title = PageTitle;

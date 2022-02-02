import '../../polyfill';
import * as React from 'react';
import clsx from 'clsx';
import './spinner.styles.scss';

interface SpinnerProps {
	isDark?: boolean;
	className?: string;
}

export const Spinner = ({ isDark, className }: SpinnerProps) => {
	return (
		<div className={clsx('spinner', isDark && 'dark', className)}>
			<div className="double-bounce1" />
			<div className="double-bounce2" />
		</div>
	);
};

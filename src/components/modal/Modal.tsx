import * as React from 'react';
import clsx from 'clsx';
import './modal.styles.scss';

interface ModalProps {
	isVisible?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export const Modal = ({ isVisible, className, children }: ModalProps) => {
	return (
		<div className={clsx('modal', className, !isVisible && 'hidden')}>
			{children}
		</div>
	);
};

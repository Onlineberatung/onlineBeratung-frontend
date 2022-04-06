import * as React from 'react';
import clsx from 'clsx';
import './modal.styles.scss';

interface ModalProps {
	className?: string;
	children: React.ReactNode;
}

export const Modal = ({ className, children }: ModalProps) => {
	return <div className={clsx('modal', className)}>{children}</div>;
};

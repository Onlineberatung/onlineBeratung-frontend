import * as React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import clsx from 'clsx';
import './modalMui.styles.scss';

interface ModalProps {
	className?: string;
	children: React.ReactNode;
	open?: boolean;
	onClose?: () => void;
}

/**
 * MUI Dialog wrapper that maintains API compatibility with the old Modal component
 * Used for full-screen overlays like loading spinners
 */
export const ModalMui = ({ 
	className, 
	children,
	open = true,
	onClose 
}: ModalProps) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth={false}
			className={clsx('modal-mui', className)}
			PaperProps={{
				className: 'modal-mui__paper'
			}}
			// Disable backdrop click and escape key by default for loading screens
			disableEscapeKeyDown={!onClose}
			onBackdropClick={onClose}
		>
			<DialogContent className="modal-mui__content">
				{children}
			</DialogContent>
		</Dialog>
	);
};

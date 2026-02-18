import * as React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './attachmentModal.styles.scss';

interface AttachmentModalProps {
	open: boolean;
	onClose: () => void;
	type: 'image' | 'pdf';
	src: string;
	title: string;
}

export const AttachmentModal: React.FC<AttachmentModalProps> = ({
	open,
	onClose,
	type,
	src,
	title
}) => {
	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="attachment-modal-title"
			className="attachmentModal"
		>
			<Box className="attachmentModal__content">
				<Box className="attachmentModal__header">
					<h2 id="attachment-modal-title" className="attachmentModal__title">
						{title}
					</h2>
					<IconButton
						onClick={onClose}
						className="attachmentModal__closeButton"
						aria-label="Close"
					>
						<CloseIcon />
					</IconButton>
				</Box>
				<Box className="attachmentModal__body">
					{type === 'image' && (
						<img
							src={src}
							alt={title}
							className="attachmentModal__image"
						/>
					)}
					{type === 'pdf' && (
						<iframe
							src={src}
							title={title}
							className="attachmentModal__pdf"
						/>
					)}
				</Box>
			</Box>
		</Modal>
	);
};

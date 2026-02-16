import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { MenuHorizontalIcon } from '../../resources/img/icons';
import './flyoutMenuMui.styles.scss';

interface FlyoutMenuProps {
	isOpen?: boolean;
	handleClose?: () => void;
	position?:
		| 'right'
		| 'left'
		| 'left-bottom'
		| 'right-bottom'
		| 'left-top'
		| 'right-top';
	isHidden?: boolean;
	children?: React.ReactNode;
}

export const FlyoutMenuMui: React.FC<FlyoutMenuProps> = ({
	children,
	isOpen: controlledIsOpen,
	handleClose: externalHandleClose = () => {},
	isHidden,
	position = 'left'
}) => {
	const { t: translate } = useTranslation();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const internalIsOpen = Boolean(anchorEl);
	
	// Use controlled state if provided, otherwise use internal state
	const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		externalHandleClose();
	};

	const childrenArray = React.Children.toArray(children).filter(Boolean);
	if (isHidden || childrenArray.length <= 0) {
		return null;
	}
	
	// Helper function to determine if a child contains critical actions (delete, ban)
	const isCriticalAction = (child: React.ReactNode): boolean => {
		if (React.isValidElement(child)) {
			const childProps = child.props as any;
			// Check if the child has className containing critical action patterns
			const className = childProps?.className || '';
			// Match whole words to avoid false positives
			return /\b(delete|ban)\b/.test(className);
		}
		return false;
	};

	// Map position prop to MUI anchorOrigin and transformOrigin
	const getAnchorProps = () => {
		switch (position) {
			case 'left':
			case 'left-bottom':
				return {
					anchorOrigin: { vertical: 'bottom' as const, horizontal: 'left' as const },
					transformOrigin: { vertical: 'top' as const, horizontal: 'right' as const }
				};
			case 'left-top':
				return {
					anchorOrigin: { vertical: 'top' as const, horizontal: 'left' as const },
					transformOrigin: { vertical: 'bottom' as const, horizontal: 'right' as const }
				};
			case 'right-top':
				return {
					anchorOrigin: { vertical: 'top' as const, horizontal: 'right' as const },
					transformOrigin: { vertical: 'bottom' as const, horizontal: 'left' as const }
				};
			case 'right':
			case 'right-bottom':
			default:
				return {
					anchorOrigin: { vertical: 'bottom' as const, horizontal: 'right' as const },
					transformOrigin: { vertical: 'top' as const, horizontal: 'left' as const }
				};
		}
	};

	const anchorProps = getAnchorProps();

	return (
		<div className={`flyoutMenuMui flyoutMenuMui--${position}`}>
			<IconButton
				aria-label={translate('app.menu')}
				title={translate('app.menu')}
				onClick={handleClick}
				className="flyoutMenuMui__trigger"
				size="small"
			>
				<MenuHorizontalIcon />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={isOpen}
				onClose={handleClose}
				{...anchorProps}
				className="flyoutMenuMui__menu"
				slotProps={{
					paper: {
						className: 'flyoutMenuMui__paper'
					}
				}}
			>
				{childrenArray.map((child, i) => {
					const isCritical = isCriticalAction(child);
					return (
						<MenuItem
							key={`flyoutMenu__item--${i}`}
							className={`flyoutMenuMui__item${isCritical ? ' critical-action' : ''}`}
							onClick={handleClose}
						>
							{child}
						</MenuItem>
					);
				})}
			</Menu>
		</div>
	);
};

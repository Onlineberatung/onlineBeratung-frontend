import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuHorizontalIcon } from '../../resources/img/icons';
import './flyoutMenu.styles.scss';

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
}

export const FlyoutMenu: React.FC<FlyoutMenuProps> = ({
	children,
	isOpen,
	handleClose = () => {},
	isHidden,
	position = 'left'
}) => {
	const [flyoutShown, setFlyoutShown] = useState(false);
	const { t: translate } = useTranslation();

	const handleFlyout = useCallback(() => {
		setFlyoutShown(!flyoutShown);
		if (!flyoutShown) {
			handleClose();
		}
	}, [flyoutShown, handleClose]);

	useEffect(() => {
		setFlyoutShown(isOpen);
	}, [isOpen]);

	useEffect(() => {
		if (flyoutShown) {
			document.addEventListener('click', handleFlyout);
		} else {
			document.removeEventListener('click', handleFlyout);
		}
		return () => {
			// remove listener when component is unmounted
			document.removeEventListener('click', handleFlyout);
		};
	}, [flyoutShown, handleFlyout]);

	const childrenArray = React.Children.toArray(children).filter(Boolean);
	if (isHidden || childrenArray.length <= 0) {
		return null;
	}

	return (
		<div className={`flyoutMenu flyoutMenu--${position}`}>
			<button
				aria-label={translate('app.menu')}
				title={translate('app.menu')}
				onClick={handleFlyout}
				className="flyoutMenu__trigger"
			>
				<MenuHorizontalIcon />
			</button>
			<div
				className={`flyoutMenu__content ${
					flyoutShown ? 'flyoutMenu__content--shown' : ''
				}`}
			>
				{childrenArray.map(
					(child, i) =>
						child && (
							<div
								className="flyoutMenu__item"
								key={`flyoutMenu__item--${i}`}
							>
								{child}
							</div>
						)
				)}
			</div>
		</div>
	);
};

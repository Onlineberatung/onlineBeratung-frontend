import React, { useCallback, useEffect, useState } from 'react';
import { MenuHorizontalIcon } from '../../resources/img/icons';
import './flyoutMenu.styles.scss';

interface FlyoutMenuProps {}

export const FlyoutMenu: React.FC<FlyoutMenuProps> = ({ children }) => {
	const [flyoutShown, setFlyoutShown] = useState(false);

	const handleFlyout = useCallback(() => {
		// TODO detect available space (?)
		setFlyoutShown(!flyoutShown);
	}, [flyoutShown]);

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

	return (
		<div className="flyoutMenu">
			<button onClick={handleFlyout} className="flyoutMenu__trigger">
				<MenuHorizontalIcon />
			</button>

			<div
				className={`flyoutMenu__content ${
					flyoutShown ? 'flyoutMenu__content--shown' : ''
				}`}
			>
				{React.Children.map(children, (child) => (
					<div className="flyoutMenu__item">{child}</div>
				))}
			</div>
		</div>
	);
};

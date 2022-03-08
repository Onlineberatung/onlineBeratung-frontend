import React, { useCallback, useEffect, useState } from 'react';
import { MenuHorizontalIcon } from '../../resources/img/icons';

interface FlyoutMenuProps {}

export const FlyoutMenu: React.FC<FlyoutMenuProps> = ({ children }) => {
	const [flyoutShown, setFlyoutShown] = useState(false);

	const handleFlyout = useCallback(() => {
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

			{flyoutShown && (
				<div className="flyoutMenu__content">{children}</div>
			)}
		</div>
	);
};

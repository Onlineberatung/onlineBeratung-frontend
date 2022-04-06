import * as React from 'react';
import useTenantTheming from '../../utils/useTenantTheming';
import { Modal } from '../modal/Modal';
import { Spinner } from '../spinner/Spinner';

export const TenantThemingLoader = () => {
	const isLoadingTheme = useTenantTheming();

	return isLoadingTheme ? (
		<Modal>
			<div>
				<Spinner isDark />
			</div>
		</Modal>
	) : null;
};

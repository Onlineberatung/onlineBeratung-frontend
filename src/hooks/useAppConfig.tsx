import { AppConfigContext, AppConfigInterface } from '../globalState';
import React from 'react';

export const useAppConfig = (): AppConfigInterface => {
	return React.useContext(AppConfigContext);
};

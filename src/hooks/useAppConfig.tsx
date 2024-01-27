import { AppConfigContext } from '../globalState';
import { AppConfigInterface } from '../globalState/interfaces';
import React from 'react';

export const useAppConfig = (): AppConfigInterface => {
	return React.useContext(AppConfigContext);
};

import * as React from 'react';
import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import caritas from '../../../config/caritas';

export const Theme = ({ children }: { children: ReactNode }) => {
	return <ThemeProvider theme={caritas}>{children}</ThemeProvider>;
};

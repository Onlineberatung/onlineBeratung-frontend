import * as React from 'react';
import { createContext, useState } from 'react';

export const ThemeContext = createContext<any>('default');

export function ThemeProvider(props) {
	const [theme, setTheme] = useState('default');

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{props.children}
		</ThemeContext.Provider>
	);
}

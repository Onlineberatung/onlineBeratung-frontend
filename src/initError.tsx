import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Error } from './components/error/Error';
import { config } from './resources/scripts/config';

const container = document.getElementById('errorRoot');
if (container) {
	const root = createRoot(container);
	root.render(<Error config={config} />);
}

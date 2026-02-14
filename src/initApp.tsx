import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/app/app';
import { Stage } from './components/stage/stage';
import { config } from './resources/scripts/config';

const container = document.getElementById('appRoot');
if (container) {
	const root = createRoot(container);
	root.render(<App config={config} stageComponent={Stage} />);
}

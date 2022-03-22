import { Steps } from 'intro.js-react';
import * as React from 'react';
import { useState } from 'react';
import stepsData from './steps';
import { config } from '../../resources/scripts/config';
import 'intro.js/introjs.css';

export const Walkthrough = () => {
	const [stepsEnabled, setStepsEnabled] = useState(config.enableWalkthrough);

	return (
		<Steps
			enabled={stepsEnabled}
			onExit={() => {
				setStepsEnabled(!stepsEnabled);
			}}
			steps={stepsData}
			initialStep={0}
		/>
	);
};

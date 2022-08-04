import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app/app';
import { Stage } from './components/stage/stage';
import { config } from './resources/scripts/config';
import { useTranslation } from 'react-i18next';

// ! TODO REMOVE NEXT LINE: only for debugging
import i18n from './i18n';

const AppWrapper = () => {
	const { t: translate } = useTranslation();

	return (
		<>
			<App
				entryPoint="/login"
				legalLinks={[
					{
						url: config.urls.imprint,
						label: translate('login.legal.infoText.impressum')
					},
					{
						url: config.urls.privacy,
						label: translate('login.legal.infoText.dataprotection'),
						registration: true
					}
				]}
				stageComponent={Stage}
			/>
			{/* ! TODO REMOVE - ONLY FOR DEBUGGING */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					zIndex: 999999
				}}
			>
				<button
					onClick={() => {
						i18n.changeLanguage('deFormal');
						console.log(i18n);
					}}
				>
					DE Sie
				</button>
				<button
					onClick={() => {
						i18n.changeLanguage('deInformal');
						console.log(i18n);
					}}
				>
					DE Du
				</button>
				<button
					onClick={() => {
						i18n.changeLanguage('enFormal');
						console.log(i18n);
					}}
				>
					EN
				</button>
			</div>
			{/* ---------- */}
		</>
	);
};

ReactDOM.render(<AppWrapper />, document.getElementById('appRoot'));

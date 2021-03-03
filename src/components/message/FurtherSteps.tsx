import * as React from 'react';
import './furtherSteps.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

export const FurtherSteps = () => {
	return (
		<div className="furtherSteps">
			<Headline
				semanticLevel="4"
				text="Vielen Dank für Ihre Nachricht! So geht es weiter:"
			/>
			<Headline
				semanticLevel="5"
				text="E-Mail-Benachrichtigung erhalten"
			/>
			<Text
				type="standard"
				text="Das System benachrichtigt Sie, sobald Sie eine Antwort bekommen haben. Geben Sie dazu Ihre E-Mail-Adresse an."
			/>
		</div>
	);
};

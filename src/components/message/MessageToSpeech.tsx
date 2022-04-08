import * as React from 'react';
import { useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import { ReactComponent as PlayIcon } from '../../resources/img/icons/speech-bubble.svg';

interface MessageToSpeechProps {
	right: Boolean;
	message: string;
}

export const MessageToSpeech = (props: MessageToSpeechProps) => {
	const synth = window.speechSynthesis;
	const voices = synth.getVoices();
	const germanVoice = voices.find((voice) => voice.lang === 'de-DE');

	const messageToSpeech = () => {
		const regex = /(<([^>]+)>)/gi;
		const cleanMessage = props.message.replace(regex, '');
		// console.log('message', cleanMessage);
		let utterThis = new SpeechSynthesisUtterance(cleanMessage);
		utterThis.voice = germanVoice;
		synth.speak(utterThis);
	};

	return (
		<div
			className={
				props.right
					? `messageItem__action messageItem__action--right`
					: `messageItem__action`
			}
			title={'Nachricht abspielen'}
			role="button"
			aria-label={translate('message.copy.title')}
			onClick={() => messageToSpeech()}
		>
			<PlayIcon />
		</div>
	);
};

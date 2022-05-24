import * as React from 'react';
import { Header } from '../header/Header';
import './waitingRoom.styles';
import { translate } from '../../utils/translate';
import { useEffect } from 'react';
import { Welcome } from './WaitingRoom/Welcome';
import { Waiting } from './WaitingRoom/Waiting';
import { LegalLinkInterface } from '../../globalState';
import {
	STATUS_CREATED,
	STATUS_PAUSED,
	STATUS_STARTED
} from '../../globalState/interfaces/AppointmentsDataInterface';
import { PausedOrFinished } from './WaitingRoom/PausedOrFinished';
import { Error } from './WaitingRoom/Error';

export interface WaitingRoomProps {
	confirmed: boolean;
	otherClass?: string;
	setConfirmed: Function;
	legalLinks: Array<LegalLinkInterface>;
	error?: {
		title: string;
		description?: string;
	};
	status:
		| typeof STATUS_STARTED
		| typeof STATUS_CREATED
		| typeof STATUS_PAUSED;
}

export const WaitingRoom = ({
	otherClass,
	confirmed,
	setConfirmed,
	legalLinks,
	status,
	error
}: WaitingRoomProps) => {
	useEffect(() => {
		document.title = `${translate(
			'videoConference.waitingroom.title.start'
		)}`;
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleConfirmButton = () => {
		setConfirmed(true);
		window.scrollTo(0, 0);
	};

	const getContent = () => {
		if (error) {
			return <Error error={error} />;
		} else if (!confirmed) {
			return (
				<Welcome
					onClick={handleConfirmButton}
					legalLinks={legalLinks}
				/>
			);
		} else if (status === STATUS_PAUSED) {
			return <PausedOrFinished />;
		} else {
			return <Waiting />;
		}
	};

	return (
		<>
			<div className={otherClass ? otherClass : 'waitingRoom'}>
				<Header />
				<div className="waitingRoom__contentWrapper">
					{getContent()}
				</div>
			</div>
		</>
	);
};

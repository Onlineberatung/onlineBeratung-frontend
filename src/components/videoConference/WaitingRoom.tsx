import * as React from 'react';
import { Header } from '../header/Header';
import './waitingRoom.styles';
import { useEffect } from 'react';
import { Welcome } from './WaitingRoom/Welcome';
import { Waiting } from './WaitingRoom/Waiting';
import {
	STATUS_CREATED,
	STATUS_PAUSED,
	STATUS_STARTED
} from '../../globalState/interfaces/AppointmentsDataInterface';
import { PausedOrFinished } from './WaitingRoom/PausedOrFinished';
import { Error } from './WaitingRoom/Error';
import { useTranslation } from 'react-i18next';

export interface WaitingRoomProps {
	confirmed: boolean;
	otherClass?: string;
	setConfirmed: Function;
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
	status,
	error
}: WaitingRoomProps) => {
	const { t: translate } = useTranslation();
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
			return <Welcome onClick={handleConfirmButton} />;
		} else if (status === STATUS_PAUSED) {
			return <PausedOrFinished />;
		} else {
			return <Waiting />;
		}
	};

	return (
		<>
			<div className={otherClass ? otherClass : 'waitingRoom'}>
				<Header showLocaleSwitch={true} />
				<div className="waitingRoom__contentWrapper">
					{getContent()}
				</div>
			</div>
		</>
	);
};

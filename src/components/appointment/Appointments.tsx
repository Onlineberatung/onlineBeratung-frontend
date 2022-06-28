import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
	setProfileWrapperActive,
	setProfileWrapperInactive
} from '../app/navigationHandler';
import {
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem,
	OverlayWrapper
} from '../overlay/Overlay';
import { translate } from '../../utils/translate';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import './appointments.styles.scss';
import {
	LegalLinkInterface,
	NOTIFICATION_TYPE_SUCCESS,
	NotificationsContext
} from '../../globalState';
import { ScrollableSection } from '../scrollableSection/ScrollableSection';
import { ScrollableSectionHeader } from '../scrollableSection/ScrollableSectionHeader';
import { ScrollableSectionBody } from '../scrollableSection/ScrollableSectionBody';
import { ScrollableSectionFooter } from '../scrollableSection/ScrollableSectionFooter';
import {
	dateToLocalISO,
	getPrettyDateFromMessageDate
} from '../../utils/dateHelpers';
import { OnlineMeetingForm } from './OnlineMeetingForm';
import { Appointment } from './Appointment';
import { ReactComponent as CameraPlusIcon } from '../../resources/img/icons/camera-plus.svg';
import { Loading } from '../app/Loading';
import { useResponsive } from '../../hooks/useResponsive';
import { AppointmentsDataInterface } from '../../globalState/interfaces/AppointmentsDataInterface';
import * as appointmentService from '../../api/appointments';
import { Text } from '../text/Text';

export const onlineMeetingFormOverlay = (
	onChange,
	onlineMeeting
): OverlayItem => ({
	headline: onlineMeeting.id
		? translate('appointments.onlineMeeting.overlay.edit.headline')
		: translate('appointments.onlineMeeting.overlay.add.headline'),
	nestedComponent: (
		<OnlineMeetingForm onChange={onChange} onlineMeeting={onlineMeeting} />
	),
	buttonSet: [
		{
			label: translate(
				'appointments.onlineMeeting.overlay.add.button.cancel'
			),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.SECONDARY
		},
		{
			label: translate(
				'appointments.onlineMeeting.overlay.add.button.add'
			),
			function: 'SAVE',
			type: BUTTON_TYPES.PRIMARY,
			disabled: !onlineMeeting.datetime
		}
	]
});

interface AppointmentsProps {
	legalLinks: Array<LegalLinkInterface>;
}

export const Appointments = ({ legalLinks }: AppointmentsProps) => {
	const { addNotification } = useContext(NotificationsContext);

	const [loading, setLoading] = useState(true);
	const [appointments, setAppointments] = useState<
		AppointmentsDataInterface[]
	>([]);

	const { fromL } = useResponsive();

	useEffect(() => {
		appointmentService
			.getAppointments()
			.then((appointments) => {
				setAppointments(appointments);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const saveAppointment = useCallback(
		(appointment) => {
			let savePromise;

			if (appointment.id) {
				savePromise = appointmentService.putAppointment(
					appointment.id,
					appointment
				);
			} else {
				savePromise = appointmentService.postAppointments(appointment);
			}

			savePromise
				.then((res) => res.json())
				.then((appointment) => {
					const newAppointments = [...appointments];
					const index = newAppointments.findIndex(
						(a) => a.id === appointment.id
					);
					if (index >= 0) {
						newAppointments.splice(index, 1, appointment);
					} else {
						newAppointments.push(appointment);
					}
					setAppointments(newAppointments);

					addNotification({
						notificationType: NOTIFICATION_TYPE_SUCCESS,
						title: translate(
							'appointments.notification.saved.title'
						),
						text: ''
					});
				})
				.catch((err) => {
					console.error(err);
				});
		},
		[addNotification, appointments]
	);

	const [overlayItem, setOverlayItem] = useState(null);
	const [onlineMeeting, setOnlineMeeting] =
		useState<AppointmentsDataInterface>({});

	useEffect(() => {
		setProfileWrapperActive();
		return () => {
			setProfileWrapperInactive();
		};
	}, []);

	const handleOverlay = useCallback(
		(buttonFunction: string) => {
			switch (buttonFunction) {
				case 'SAVE':
					if (!onlineMeeting.datetime) {
						return;
					}
					setOverlayItem(null);
					saveAppointment(onlineMeeting);
					setOnlineMeeting({});
					break;
				case OVERLAY_FUNCTIONS.CLOSE:
					setOverlayItem(null);
					setOnlineMeeting({});
					break;
			}
		},
		[saveAppointment, onlineMeeting]
	);

	const addVideoCallButton: ButtonItem = {
		type: BUTTON_TYPES.PRIMARY,
		icon: <CameraPlusIcon />
	};

	const changeOnlineMeeting = useCallback((onlineMeeting) => {
		setOnlineMeeting(onlineMeeting);
		setOverlayItem(
			onlineMeetingFormOverlay(changeOnlineMeeting, onlineMeeting)
		);
	}, []);

	const editAppointment = useCallback(
		(appointment) => {
			setOverlayItem(
				onlineMeetingFormOverlay(changeOnlineMeeting, appointment)
			);
		},
		[changeOnlineMeeting]
	);

	const deleteAppointment = useCallback(
		(appointment) => {
			appointmentService.deleteAppointment(appointment.id).then(() => {
				const index = appointments.findIndex(
					(a) => a.id === appointment.id
				);
				const newAppointments = [...appointments];
				if (index >= 0) {
					newAppointments.splice(index, 1);
				}
				setAppointments(newAppointments);
			});
		},
		[appointments]
	);

	let lastDate = null;
	let lastMonth = null;

	return (
		<div className="appointments">
			<ScrollableSection offset={fromL ? 0 : 72}>
				<ScrollableSectionHeader>
					<div className="flex px--2 px-l--0 py--3">
						<div className="flex__col--0 flex-l__col--25p">
							&nbsp;
						</div>
						<div className="appointments__headline flex__col--75p flex-l__col--50p">
							<h3>{translate('appointments.title')}</h3>
						</div>
						<div className="appointments__actions flex__col--25p flex flex--jc-fe">
							<div>
								<Button
									buttonHandle={() =>
										setOverlayItem(
											onlineMeetingFormOverlay(
												changeOnlineMeeting,
												onlineMeeting
											)
										)
									}
									item={addVideoCallButton}
								/>
							</div>
						</div>
					</div>
				</ScrollableSectionHeader>
				<ScrollableSectionBody>
					{loading ? (
						<Loading />
					) : appointments.length <= 0 ? (
						<div className="text--center">
							{translate('appointments.noAppointments')}
						</div>
					) : (
						<div className="px--2 px-l--0">
							{appointments
								.sort((a, b) => {
									const dateA = new Date(a.datetime);
									const dateB = new Date(b.datetime);
									if (dateA === dateB) {
										return 0;
									}
									return dateA > dateB ? 1 : -1;
								})
								.map((appointment, i) => {
									const date = new Date(appointment.datetime);
									const dateStr = dateToLocalISO(date).slice(
										0,
										10
									);
									const monthStr = dateToLocalISO(date).slice(
										0,
										7
									);

									const tomorrow = new Date();
									tomorrow.setDate(tomorrow.getDate() + 1);
									const tomorrowStr = dateToLocalISO(
										tomorrow
									).slice(0, 10);

									let dividerType = null;
									if (
										lastDate !== dateStr &&
										dateStr <= tomorrowStr
									) {
										lastDate = dateStr;
										dividerType = 'day';
									} else if (
										lastMonth !== monthStr &&
										dateStr > tomorrowStr
									) {
										lastMonth = monthStr;
										dividerType = 'month';
									}

									return (
										<React.Fragment key={appointment.id}>
											{dividerType && (
												<AppointmentDivider
													date={date}
													type={dividerType}
													index={i}
												/>
											)}
											<Appointment
												appointment={appointment}
												editClick={editAppointment}
												deleteClick={deleteAppointment}
											/>
										</React.Fragment>
									);
								})}
						</div>
					)}

					{overlayItem && (
						<OverlayWrapper>
							<Overlay
								item={overlayItem}
								handleOverlay={handleOverlay}
							/>
						</OverlayWrapper>
					)}
				</ScrollableSectionBody>
				<ScrollableSectionFooter>
					<div className="px--3 flex flex--ai-c flex--jc-c flex-l--jc-fs">
						{legalLinks.map((legalLink, index) => (
							<React.Fragment key={legalLink.url}>
								{index > 0 && (
									<Text
										type="infoSmall"
										className="profile__footer__separator"
										text=" | "
									/>
								)}
								<a
									key={legalLink.url}
									href={legalLink.url}
									target="_blank"
									rel="noreferrer"
								>
									<Text
										className="profile__footer__item"
										type="infoSmall"
										text={legalLink.label}
									/>
								</a>
							</React.Fragment>
						))}
					</div>
				</ScrollableSectionFooter>
			</ScrollableSection>
		</div>
	);
};

type AppointmentDividerProps = {
	date: Date;
	type: 'day' | 'month';
	index?: number;
};

const AppointmentDivider = ({ date, type, index }: AppointmentDividerProps) => {
	return (
		<div
			className={`appointment__divider flex ${
				index === 0 ? 'mb--2' : 'mb--2 mt--6'
			}`}
		>
			<hr className="my--1" />
			<div className="flex__col--no-grow text--nowrap text--secondary text--uppercase px--3">
				{type === 'day'
					? getPrettyDateFromMessageDate(
							date.getTime() / 1000,
							true,
							true
					  )
					: translate(`date.month.${date.getMonth()}`)}
			</div>
			<hr className="my--1" />
		</div>
	);
};

import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import './appointments.styles.scss';
import {
	AgencySpecificContext,
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
import { ReactComponent as WaitingIllustration } from '../../resources/img/illustrations/chat-waiting.svg';
import { Loading } from '../app/Loading';
import { useResponsive } from '../../hooks/useResponsive';
import { AppointmentsDataInterface } from '../../globalState/interfaces/AppointmentsDataInterface';
import * as appointmentService from '../../api/appointments';
import { Text } from '../text/Text';
import { useTranslation } from 'react-i18next';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { ListInfo } from '../listInfo/ListInfo';

export const Appointments = () => {
	const { t: translate } = useTranslation();
	const legalLinks = useContext(LegalLinksContext);
	const { specificAgency } = useContext(AgencySpecificContext);
	const { addNotification } = useContext(NotificationsContext);

	const [loading, setLoading] = useState(true);
	const [appointments, setAppointments] = useState<
		AppointmentsDataInterface[]
	>([]);

	const { fromL } = useResponsive();

	const OnlineMeetingFormOverlay = useCallback(
		(onChange, onlineMeeting): OverlayItem => {
			return {
				headline: onlineMeeting.id
					? translate(
							'appointments.onlineMeeting.overlay.edit.headline'
					  )
					: translate(
							'appointments.onlineMeeting.overlay.add.headline'
					  ),
				nestedComponent: (
					<OnlineMeetingForm
						onChange={onChange}
						onlineMeeting={onlineMeeting}
					/>
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
			};
		},
		[translate]
	);

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
		[addNotification, appointments, translate]
	);

	const [overlayItem, setOverlayItem] = useState(null);
	const [onlineMeeting, setOnlineMeeting] =
		useState<AppointmentsDataInterface>({});

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
		icon: <CameraPlusIcon />,
		title: translate('appointments.newAppointment')
	};

	const changeOnlineMeeting = useCallback(
		(onlineMeeting) => {
			setOnlineMeeting(onlineMeeting);
			setOverlayItem(
				OnlineMeetingFormOverlay(changeOnlineMeeting, onlineMeeting)
			);
		},
		[OnlineMeetingFormOverlay]
	);

	const editAppointment = useCallback(
		(appointment) => {
			setOverlayItem(
				OnlineMeetingFormOverlay(changeOnlineMeeting, appointment)
			);
		},
		[changeOnlineMeeting, OnlineMeetingFormOverlay]
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
											OnlineMeetingFormOverlay(
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
						<ListInfo
							headline={translate('appointments.noAppointments')}
							Illustration={WaitingIllustration}
							hasSeparator={true}
						></ListInfo>
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
						<Overlay
							item={overlayItem}
							handleOverlay={handleOverlay}
						/>
					)}
				</ScrollableSectionBody>
				<ScrollableSectionFooter>
					<div className="profile__footer">
						{legalLinks.map((legalLink, index) => (
							<React.Fragment
								key={legalLink.getUrl({
									aid: specificAgency?.id
								})}
							>
								{index > 0 && (
									<Text
										type="infoSmall"
										className="profile__footer__separator"
										text=" | "
									/>
								)}
								<a
									key={legalLink.getUrl({
										aid: specificAgency?.id
									})}
									href={legalLink.getUrl({
										aid: specificAgency?.id
									})}
									target="_blank"
									rel="noreferrer"
								>
									<Text
										className="profile__footer__item"
										type="infoSmall"
										text={translate(legalLink.label)}
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
	const { t: translate } = useTranslation();
	const month = translate(`date.month.${date.getMonth()}.long`);
	const prettyDate = getPrettyDateFromMessageDate(
		date.getTime() / 1000,
		true,
		true
	);
	var day =
		translate(prettyDate.str) +
		(prettyDate.date ? ',' + prettyDate.date : '');

	return (
		<div
			className={`appointment__divider flex ${
				index === 0 ? 'mb--2' : 'mb--2 mt--6'
			}`}
		>
			<hr className="my--1" />
			<div className="flex__col--no-grow text--nowrap text--secondary text--uppercase px--3">
				{type === 'day' ? day : month}
			</div>
			<hr className="my--1" />
		</div>
	);
};

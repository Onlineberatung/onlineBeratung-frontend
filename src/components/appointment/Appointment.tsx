import * as React from 'react';
import { useCallback, useContext, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { Box } from '../box/Box';
import {
	NOTIFICATION_TYPE_SUCCESS,
	NotificationsContext,
	UserDataContext
} from '../../globalState';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import { ReactComponent as PenIcon } from '../../resources/img/icons/pen.svg';
import { ReactComponent as TrashIcon } from '../../resources/img/icons/trash.svg';
import { GenerateQrCode } from '../generateQrCode/GenerateQrCode';
import './appointment.styles.scss';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { uiUrl } from '../../resources/scripts/config';
import { AppointmentsDataInterface } from '../../globalState/interfaces/AppointmentsDataInterface';
import { supportsE2EEncryptionVideoCall } from '../../utils/videoCallHelpers';
import { videoCallErrorOverlayItem } from '../sessionMenu/sessionMenuHelpers';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

const DESCRIPTION_PREVIEW_LENGTH = 100;

type AppointmentProps = {
	appointment: AppointmentsDataInterface;
	editClick: Function;
	deleteClick: Function;
};

export const Appointment = ({
	appointment,
	editClick,
	deleteClick
}: AppointmentProps) => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();
	const history = useHistory();

	const { userData } = useContext(UserDataContext);

	const [overlayItem, setOverlayItem] = useState(null);
	const [showMore, setShowMore] = useState(false);

	const startVideoCallButton: ButtonItem = {
		label: translate('appointments.onlineMeeting.start'),
		type: BUTTON_TYPES.SMALL_ICON,
		smallIconBackgroundColor: 'secondary'
	};

	const date = new Date(appointment.datetime);

	const toggleShowMore = useCallback(() => {
		setShowMore(!showMore);
	}, [showMore]);

	const startVideoCallOverlay: OverlayItem = {
		headline: translate(
			'appointments.onlineMeeting.overlay.start.headline'
		),
		copy: translate('appointments.onlineMeeting.overlay.start.copy'),
		buttonSet: [
			{
				label: translate(
					'appointments.onlineMeeting.overlay.start.button.cancel'
				),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY
			},
			{
				label: translate(
					'appointments.onlineMeeting.overlay.start.button.start'
				),
				function: 'START',
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	const deleteVideoCallOverlay: OverlayItem = {
		headline: translate(
			'appointments.onlineMeeting.overlay.delete.headline'
		),
		copy: translate('appointments.onlineMeeting.overlay.delete.copy'),
		buttonSet: [
			{
				label: translate(
					'appointments.onlineMeeting.overlay.delete.button.cancel'
				),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY
			},
			{
				label: translate(
					'appointments.onlineMeeting.overlay.delete.button.delete'
				),
				function: 'REMOVE',
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	const handleOverlay = useCallback(
		(buttonFunction: string) => {
			switch (buttonFunction) {
				case 'START':
					setOverlayItem(null);
					window.open(
						`${uiUrl}${generatePath(
							settings.urls.consultantVideoConference,
							{
								type: 'app',
								appointmentId: appointment.id
							}
						)}`
					);
					break;
				case 'REMOVE':
					setOverlayItem(null);
					deleteClick(appointment);
					break;
				case OVERLAY_FUNCTIONS.CLOSE:
					setOverlayItem(null);
					break;
				case 'GOTO_MANUAL':
					history.push('/profile/hilfe/videoCall');
					break;
			}
		},
		[
			appointment,
			deleteClick,
			history,
			settings.urls.consultantVideoConference
		]
	);

	const shortDescription = useCallback((description) => {
		if (description.length <= DESCRIPTION_PREVIEW_LENGTH) {
			return description;
		}

		return (
			description.substring(
				0,
				description.lastIndexOf(' ', DESCRIPTION_PREVIEW_LENGTH - 4)
			) + ' ... '
		);
	}, []);

	return (
		<Box>
			<div className="flex flex--fd-column flex-l--fd-row">
				<div className="flex mb--3 mb-l--0">
					<div className="appointment__date flex__col--1 flex-l__col--0 flex flex--fd-row flex--ai-fe flex-l--fd-column flex-l--ai-c mr--4 text--nowrap text--bold">
						<span className="mr--1 mr-l--0">
							{(date.getDate() + 100).toString().substring(1)}
						</span>
						{translate(`date.month.${date.getMonth()}.short`)}
					</div>
					<div className="d--b d-l--n flex__col--0">
						<AppointmentActions
							onDelete={() =>
								setOverlayItem(deleteVideoCallOverlay)
							}
							onEdit={() => editClick(appointment)}
						/>
					</div>
				</div>
				<div className="flex__col--1">
					<div className="flex">
						<div className="flex__col--1">
							<div className="mb--1 text--bold">
								{translate(`date.day.${date.getDay()}.long`)},{' '}
								{(date.getHours() + 100)
									.toString()
									.substring(1)}
								:
								{(date.getMinutes() + 100)
									.toString()
									.substring(1)}{' '}
								Uhr
							</div>

							<div className="appointment__description mb--3 text--tertiary">
								{appointment.description && (
									<>
										<span
											dangerouslySetInnerHTML={{
												__html: (showMore
													? appointment.description
													: shortDescription(
															appointment.description
														)
												).replaceAll('\n', '<br/>')
											}}
										/>
										{appointment.description.length >
											DESCRIPTION_PREVIEW_LENGTH && (
											<span
												role="button"
												className="primary text--nowrap"
												onClick={toggleShowMore}
											>
												{showMore
													? translate(
															'appointments.showLess'
														)
													: translate(
															'appointments.showMore'
														)}
											</span>
										)}
									</>
								)}
							</div>
						</div>
						<div className="d--n flex__col--0 d-l--b">
							<AppointmentActions
								onDelete={() =>
									setOverlayItem(deleteVideoCallOverlay)
								}
								onEdit={() => editClick(appointment)}
							/>
						</div>
					</div>

					<div className="flex flex--fd-column flex-l--fd-row">
						<div className="flex__col--1">
							<div
								className="mb--1 tertiary text--tertiary"
								data-cy="appointment_url"
							>
								{`${uiUrl}${generatePath(
									settings.urls.videoConference,
									{
										type: 'app',
										appointmentId: appointment.id
									}
								)}`}
							</div>

							<div className="flex">
								<div
									className="mr--2"
									data-cy="appointment_qr_code"
								>
									<GenerateQrCode
										url={`${uiUrl}${generatePath(
											settings.urls.videoConference,
											{
												type: 'app',
												appointmentId: appointment.id
											}
										)}`}
										headline={translate(
											'appointments.qrCode.headline'
										)}
										text={translate(
											'appointments.qrCode.text'
										)}
										filename={`video-call-${appointment.id}`}
									/>
								</div>
								<div data-cy="appointment_link">
									<CopyAppointmentLink
										appointment={appointment}
									/>
								</div>
							</div>
						</div>
						<div
							className="flex__col--0 flex flex--ai-fe mt--3 mt-l--0"
							data-cy="appointment_start"
						>
							<Button
								className="text--nowrap"
								buttonHandle={() => {
									if (
										!supportsE2EEncryptionVideoCall(
											userData.e2eEncryptionEnabled
										)
									) {
										setOverlayItem(
											videoCallErrorOverlayItem
										);
										return;
									}
									setOverlayItem(startVideoCallOverlay);
								}}
								item={startVideoCallButton}
							/>
						</div>
					</div>
				</div>
			</div>

			{overlayItem && (
				<Overlay item={overlayItem} handleOverlay={handleOverlay} />
			)}
		</Box>
	);
};

type AppointmentActionsProps = {
	onEdit: Function;
	onDelete: Function;
};

const AppointmentActions = ({ onEdit, onDelete }: AppointmentActionsProps) => {
	return (
		<div className="flex flex--jc-fe appointment__actions">
			<div className="mr--2">
				<span
					role="button"
					className="tertiary"
					onClick={() => onEdit()}
				>
					<PenIcon />
				</span>
			</div>
			<div>
				<span
					role="button"
					className="tertiary"
					onClick={() => onDelete()}
				>
					<TrashIcon />
				</span>
			</div>
		</div>
	);
};

type CopyAppointmentLinkProps = {
	appointment: AppointmentsDataInterface;
};

const CopyAppointmentLink = ({ appointment }: CopyAppointmentLinkProps) => {
	const { t: translate } = useTranslation();
	const settings = useAppConfig();
	const { addNotification } = useContext(NotificationsContext);

	const copyRegistrationLink = useCallback(async () => {
		await copyTextToClipboard(
			`${uiUrl}${generatePath(settings.urls.videoConference, {
				type: 'app',
				appointmentId: appointment.id
			})}`,
			() => {
				addNotification({
					notificationType: NOTIFICATION_TYPE_SUCCESS,

					title: translate(
						'appointments.copy.link.notification.title'
					),
					text: translate('appointments.copy.link.notification.text')
				});
			}
		);
	}, [
		settings.urls.videoConference,
		appointment.id,
		addNotification,
		translate
	]);

	return (
		<span
			className="profile__data__copy_registration_link text--nowrap text--tertiary primary mr--2"
			role="button"
			onClick={copyRegistrationLink}
			title={translate('appointments.copy.link.title')}
			aria-label={translate('appointments.copy.link.title')}
		>
			<CopyIcon className={`copy icn--s`} />{' '}
			{translate('appointments.copy.link.text')}
		</span>
	);
};

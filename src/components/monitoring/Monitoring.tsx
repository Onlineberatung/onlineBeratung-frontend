import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { SESSION_LIST_TAB } from '../session/sessionHelpers';
import { Checkbox } from '../checkbox/Checkbox';
import { Button } from '../button/Button';
import { apiUpdateMonitoring, apiGetMonitoring } from '../../api';
import { ReactComponent as ArrowRightIcon } from '../../resources/img/icons/arrow-right.svg';
import { ReactComponent as ArrowDownIcon } from '../../resources/img/icons/arrow-down.svg';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import './monitoring.styles';
import '../profile/profile.styles';
import { Loading } from '../app/Loading';
import { useSession } from '../../hooks/useSession';
import { useSearchParam } from '../../hooks/useSearchParams';
import { SessionTypeContext } from '../../globalState';
import { useResponsive } from '../../hooks/useResponsive';
import {
	desktopView,
	mobileListView,
	mobileUserProfileView
} from '../app/navigationHandler';
import { useTranslation } from 'react-i18next';

export const Monitoring = () => {
	const { t: translate } = useTranslation();
	const { rcGroupId: groupIdFromParam } = useParams<{ rcGroupId: string }>();
	const history = useHistory();

	const { session: activeSession, ready } = useSession(groupIdFromParam);

	const [resort, setResort] = useState(null);
	const [accordionOpened, setAccordionOpened] = useState<any[]>([]);
	const [monitoringData, setMonitoringData] = useState({});
	const { path: listPath } = useContext(SessionTypeContext);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	useEffect(() => {
		if (!ready) {
			return;
		}

		if (!activeSession) {
			history.push(
				listPath +
					(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
			);
			return;
		}

		setResort(
			activeSession.item?.consultingType === 0
				? 'monitoringAddiction'
				: 'monitoringU25'
		);

		apiGetMonitoring(activeSession.item.id)
			.then(setMonitoringData)
			.catch((error) => {
				console.log(error);
			});
	}, [activeSession, history, listPath, ready, sessionListTab]);

	const { fromL } = useResponsive();
	useEffect(() => {
		if (!fromL) {
			mobileUserProfileView();
			return () => {
				mobileListView();
			};
		}
		desktopView();
	}, [fromL]);

	const handleChange = (key, parentKey) => {
		const checkObj = (obj, k, prevk) => {
			if (typeof obj === 'boolean') {
				if (key === k && prevk === parentKey) {
					return !obj;
				}
				return obj;
			}
			for (var ky in obj) {
				obj[ky] = checkObj(obj[ky], ky, k);
			}
			return obj;
		};
		setMonitoringData({ ...checkObj(monitoringData, null, null) });
	};

	const isActive = (obj) => {
		for (let i in obj) {
			if (typeof obj[i] != 'object') {
				if (obj[i] === true) {
					return true;
				}
			} else {
				if (isActive(obj[i])) {
					return isActive(obj[i]);
				}
			}
		}
		return false;
	};

	const handleAccordion = (event, key) => {
		const accordion = event.target;
		const isOpen = accordion.classList.contains('open');
		const innerWrapper = accordion.nextSibling;

		accordion.classList.toggle('open');
		if (isOpen) {
			innerWrapper.classList.add('close');
		} else {
			innerWrapper.classList.remove('close');
		}

		if (accordionOpened.includes(key)) {
			setAccordionOpened([...accordionOpened.filter((k) => k !== key)]);
		} else {
			setAccordionOpened([...accordionOpened, key]);
		}
	};

	const handleSubmit = () => {
		apiUpdateMonitoring(activeSession.item.id, monitoringData)
			.then(() => {
				history.push(
					`${listPath}/${activeSession.item.groupId}/${
						activeSession.item.id
					}/userProfile${
						sessionListTab
							? `?sessionListTab=${sessionListTab}`
							: ''
					}`
				);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const renderAccordion = (id, data) => {
		const iterate = () => {
			let result: JSX.Element[] = [];
			for (let key in data) {
				let value = data[key];
				result.push(renderSnippet(key, value, id));
			}
			return result;
		};

		const renderSnippet = (key, value, parentId?) => {
			// check which type of data was given
			const type = !id ? 'first' : typeof value;
			let active = false;
			let open: string | null = null;

			switch (type) {
				case 'first':
					active = isActive(value);
					return (
						<div
							id={key}
							className="monitoringAccordion__outer__wrapper"
							key={key}
						>
							<div className="monitoringAccordion__innerWrapper">
								<h4
									className={
										'monitoringAccordion__sectionTitle ' +
										active
									}
								>
									{translate(
										'monitoring.' + resort + '.' + key
									)}
								</h4>
								{renderAccordion(key, value)}
							</div>
						</div>
					);
				case 'object':
					active = isActive(value);
					open =
						active || accordionOpened.includes(key) ? 'open' : null;
					return (
						<div
							id={key}
							className="monitoringAccordion__wrapper"
							key={key}
						>
							<p
								onClick={(e) => handleAccordion(e, key)}
								className={
									'monitoringAccordion__wrapper__title ' +
									active +
									' ' +
									open
								}
							>
								<ArrowRightIcon
									className="monitoringAccordion__closedIcon"
									title={translate('app.open')}
									aria-label={translate('app.open')}
								/>
								<ArrowDownIcon
									className="monitoringAccordion__activeIcon"
									title={translate('app.close')}
									aria-label={translate('app.close')}
								/>
								<span>
									{translate(
										'monitoring.' + resort + '.' + key
									)}
								</span>
								{active ? (
									<CheckmarkIcon
										className="monitoringAccordion__checkIcon"
										title={translate('monitoring.checked')}
										aria-label={translate(
											'monitoring.checked'
										)}
									/>
								) : null}
							</p>
							<div className="monitoringAccordion__innerWrapper">
								{open ? renderAccordion(key, value) : null}
							</div>
						</div>
					);
				default:
					return (
						<div key={key} className="monitoringAccordion__item">
							<p className="monitoringAccordion__headline"></p>
							<div className="profile__data__item__accordion">
								<Checkbox
									item={{
										inputId: `${parentId}_${key}`,
										name: key,
										labelId: key + 'Label',
										label: translate(
											'monitoring.' + resort + '.' + key
										),
										checked: value
									}}
									checkboxHandle={() =>
										handleChange(key, parentId)
									}
								/>
							</div>
						</div>
					);
			}
		};
		return iterate();
	};

	if (!activeSession) {
		return <Loading></Loading>;
	}

	return (
		<div className="profile__wrapper">
			<div className="profile__header">
				<div className="profile__header__wrapper">
					<Link
						to={`${listPath}/${activeSession.item.groupId}/${
							activeSession.item.id
						}/userProfile${
							sessionListTab
								? `?sessionListTab=${sessionListTab}`
								: ''
						}`}
						className="profile__header__backButton"
					>
						<BackIcon />
					</Link>
					<h3 className="profile__header__title profile__header__title--withBackButton">
						{translate('monitoring.title')}
					</h3>
				</div>
				<div className="profile__header__metaInfo">
					<p className="profile__header__username profile__header__username--withBackButton">
						{activeSession.user.username}
					</p>
				</div>
			</div>
			<div className="profile__innerWrapper">
				<div className="profile__content">
					<div className="profile__content__item">
						<div className="monitoringAccordion">
							{renderAccordion(null, monitoringData)}
						</div>

						<div className="monitoringAccordionSave">
							<Button
								item={{
									label: translate('app.save'),
									function: '',
									type: 'PRIMARY',
									id: 'monitoringSave'
								}}
								buttonHandle={handleSubmit}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

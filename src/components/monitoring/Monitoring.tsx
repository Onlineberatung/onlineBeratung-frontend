import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import {
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession
} from '../../globalState';
import { getViewPathForType } from '../session/sessionHelpers';
import { history } from '../app/app';
import { Checkbox } from '../checkbox/Checkbox';
import { Button } from '../button/Button';
import { ajaxCallUpdateMonitoring } from '../apiWrapper';
import { ajaxCallGetMonitoring } from '../apiWrapper/ajaxCallGetMonitoring';
import './monitoring.styles';

export const Monitoring = () => {
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const [accordionOpened, setAccordionOpened] = useState<any[]>([]); //TO-DO: CHECK IF THIS IS STILL WORKING -> change any to specific data type
	const [monitoringData, setMonitoringData] = useState({});

	const resort =
		activeSession.session.consultingType === 0
			? 'monitoringAddiction'
			: 'monitoringU25';

	useEffect(() => {
		ajaxCallGetMonitoring(activeSession.session.id)
			.then((monitoringData) => {
				setMonitoringData(monitoringData);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleBackButton = () => {
		const view = getViewPathForType(activeSession.type);
		history.push({
			pathname: `/sessions/consultant/${view}/${activeSession.session.groupId}/${activeSession.session.id}/userProfile`
		});
	};

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
		ajaxCallUpdateMonitoring(activeSession.session.id, monitoringData)
			.then((response) => {
				handleBackButton();
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
									onClick={() => 
										//TO-DO: CHECK IF THIS IS STILL WORKING -> repair the commented logic
										console.log('click')
										// this.handleRenderChilds(
										// 	`${key}.meta.renderChildren`
										// )
									}
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
					open = active || accordionOpened.includes(key) ? 'open' : null;
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
								<svg
									className="monitoringAccordion__closedIcon"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 72 72"
								>
									<defs>
										<path
											id="arrow-right-a"
											d="M26.9747794,6.96804002 L54.5548531,34.5856319 C55.0259154,35.0566942 55.2614465,35.6152991 55.2614465,36.2614465 C55.2614465,36.907594 55.0259154,37.4661988 54.5548531,37.9372612 L26.9747794,65.5548531 C26.5037171,66.0259154 25.9388592,66.2614465 25.2802057,66.2614465 C24.6215521,66.2614465 24.0566942,66.0259154 23.5856319,65.5548531 L17.4451469,59.3768499 C16.9740846,58.9057875 16.7385535,58.3471827 16.7385535,57.7010352 C16.7385535,57.0548878 16.9740846,56.4962829 17.4451469,56.0252206 L37.208921,36.2614465 L17.4451469,16.4976725 C16.9740846,16.0266102 16.7385535,15.4680053 16.7385535,14.8218578 C16.7385535,14.1757104 16.9740846,13.6171055 17.4451469,13.1460432 L23.5856319,6.96804002 C24.0566942,6.4969777 24.6215521,6.26144654 25.2802057,6.26144654 C25.9388592,6.26144654 26.5037171,6.4969777 26.9747794,6.96804002 Z"
										/>
									</defs>
									<use xlinkHref="#arrow-right-a" />
								</svg>
								<svg
									className="monitoringAccordion__activeIcon"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 72 72"
								>
									<defs>
										<path
											id="arrow-down-a"
											d="M65.5548531,26.9747794 L37.9372612,54.5548531 C37.4661988,55.0259154 36.907594,55.2614465 36.2614465,55.2614465 C35.6152991,55.2614465 35.0566942,55.0259154 34.5856319,54.5548531 L6.96804002,26.9747794 C6.4969777,26.5037171 6.26144654,25.9388592 6.26144654,25.2802057 C6.26144654,24.6215521 6.4969777,24.0566942 6.96804002,23.5856319 L13.1460432,17.4451469 C13.6171055,16.9740846 14.1757104,16.7385535 14.8218578,16.7385535 C15.4680053,16.7385535 16.0266102,16.9740846 16.4976725,17.4451469 L36.2614465,37.208921 L56.0252206,17.4451469 C56.4962829,16.9740846 57.0548878,16.7385535 57.7010352,16.7385535 C58.3471827,16.7385535 58.9057875,16.9740846 59.3768499,17.4451469 L65.5548531,23.5856319 C66.0259154,24.0566942 66.2614465,24.6215521 66.2614465,25.2802057 C66.2614465,25.9388592 66.0259154,26.5037171 65.5548531,26.9747794 Z"
										/>
									</defs>
									<use xlinkHref="#arrow-down-a" />
								</svg>
								<span>
									{translate(
										'monitoring.' + resort + '.' + key
									)}
								</span>
								{active ? (
									<svg
										className="monitoringAccordion__checkIcon"
										xmlns="http://www.w3.org/2000/svg"
										xmlnsXlink="http://www.w3.org/1999/xlink"
										width="24"
										height="24"
										viewBox="0 0 72 72"
									>
										<defs>
											<path
												id="checkmark-a"
												d="M7.25269842,33.2086244 L7.25269842,33.2086244 C8.79968309,31.139936 11.7307652,30.7170117 13.7994536,32.2639963 C13.9758883,32.3959359 14.1427805,32.5401766 14.2988833,32.6956411 L29.2722338,47.6077543 L57.1900353,8.91834707 C58.6841829,6.84770824 61.5740132,6.38036974 63.6446521,7.87451731 C63.8009903,7.98732906 63.9501193,8.10980903 64.0911656,8.24123988 L64.0911656,8.24123988 C66.2871831,10.2875493 66.6320903,13.642246 64.8983875,16.0925826 L31.9438937,62.6689641 C31.3059119,63.5706586 30.0577576,63.7844399 29.1560631,63.1464581 C29.0579244,63.0770214 28.9662462,62.9988775 28.8821421,62.9129755 L7.79547562,41.3755491 C5.62571417,39.1594056 5.39529652,35.6924148 7.25269842,33.2086244 Z"
											/>
										</defs>
										<use xlinkHref="#checkmark-a" />
									</svg>
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

	return (
		<div className="profile__wrapper">
			<div className="profile__header">
				<div className="profile__header__wrapper">
					<a
						onClick={handleBackButton}
						className="profile__header__backButton"
						href="/#" //TO-DO: CHECK IF THIS IS STILL WORKING -> otherwise use other html element
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							width="72"
							height="72"
							viewBox="0 0 72 72"
						>
							<defs>
								<path
									id="arrow-left-a"
									d="M45.0252206,6.96804002 C45.4962829,6.4969777 46.0611408,6.26144654 46.7197943,6.26144654 C47.3784479,6.26144654 47.9433058,6.4969777 48.4143681,6.96804002 L54.5548531,13.1460432 C55.0259154,13.6171055 55.2614465,14.1757104 55.2614465,14.8218578 C55.2614465,15.4680053 55.0259154,16.0266102 54.5548531,16.4976725 L34.791079,36.2614465 L54.5548531,56.0252206 C55.0259154,56.4962829 55.2614465,57.0548878 55.2614465,57.7010352 C55.2614465,58.3471827 55.0259154,58.9057875 54.5548531,59.3768499 L48.4143681,65.5548531 C47.9433058,66.0259154 47.3784479,66.2614465 46.7197943,66.2614465 C46.0611408,66.2614465 45.4962829,66.0259154 45.0252206,65.5548531 L17.4451469,37.9372612 C16.9740846,37.4661988 16.7385535,36.907594 16.7385535,36.2614465 C16.7385535,35.6152991 16.9740846,35.0566942 17.4451469,34.5856319 L45.0252206,6.96804002 Z"
								/>
							</defs>
							<use xlinkHref="#arrow-left-a" />
						</svg>
					</a>
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
					<div className="profile__content__item profile__functions">
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

import {
	createContext,
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useState
} from 'react';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { apiGetAgencyById } from '../../api';
import { apiGetTopicsData } from '../../api/apiGetTopicsData';
import { apiGetConsultant } from '../../api/apiGetConsultant';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	TopicsDataInterface
} from '../interfaces';

interface RegistrationContextInterface {
	disabledNextButton?: boolean;
	setDisabledNextButton?: Dispatch<SetStateAction<boolean>>;
	setDataForSessionStorage?: Dispatch<
		SetStateAction<Partial<RegistrationSessionStorageData>>
	>;
	sessionStorageRegistrationData?: RegistrationSessionStorageData;
	dataPrepForSessionStorage?: Partial<RegistrationSessionStorageData>;
	updateSessionStorageWithPreppedData?: () => void;
	refreshSessionStorageRegistrationData?: () => void;
	availableSteps?: {
		component: string;
		urlSuffix?: string;
		mandatoryFields?: string[];
		urlParams?: string[];
	}[];
	preselectedData?: Array<'tid' | 'zipcode' | 'aid'>;
	preselectedAgency?: AgencyDataInterface;
	preselectedTopicName?: string;
	isConsultantLink?: boolean;
	consultant?: ConsultantDataInterface;
	hasConsultantError?: boolean;
	hasAgencyError?: boolean;
	hasTopicError?: boolean;
}

export const RegistrationContext = createContext<RegistrationContextInterface>(
	{}
);

interface RegistrationSessionStorageData {
	username: string;
	password: string;
	agencyId: number;
	mainTopicId: number;
	topicGroupId?: number;
	topicId?: number;
	zipcode: string;
}

export const registrationSessionStorageKey = 'registrationData';

export function RegistrationProvider(props) {
	const getSessionStorageData = () =>
		JSON.parse(
			sessionStorage.getItem(registrationSessionStorageKey) || '{}'
		);
	const [disabledNextButton, setDisabledNextButton] = useState<boolean>(true);
	const [hasTopicError, setHasTopicError] = useState<boolean>(false);
	const [hasAgencyError, setHasAgencyError] = useState<boolean>(false);
	const [hasConsultantError, setHasConsultantError] =
		useState<boolean>(false);
	const [isConsultantLink, setIsConsultantLink] = useState<boolean>(false);
	const [consultant, setConsultant] = useState<ConsultantDataInterface>();
	const [preselectedData, setPreselectedData] = useState<
		Array<'tid' | 'zipcode' | 'aid'>
	>([]);
	const [preselectedAgency, setPreselectedAgency] =
		useState<AgencyDataInterface>();
	const [preselectedTopic, setPreselectedTopic] =
		useState<TopicsDataInterface>();
	const [preselectedTopicName, setPreselectedTopicName] = useState<string>();
	const [dataPrepForSessionStorage, setDataPrepForSessionStorage] = useState<
		Partial<RegistrationSessionStorageData>
	>({});
	const [sessionStorageRegistrationData, setSessionStorageRegistrationData] =
		useState<any>(getSessionStorageData());
	const useQuery = () => {
		const { search } = useLocation();
		return useMemo(() => new URLSearchParams(search), [search]);
	};
	const urlQuery: URLSearchParams = useQuery();
	const defaultSteps = [
		{ component: 'welcome', urlSuffix: '' },
		{
			component: 'topicSelection',
			urlSuffix: '/topic-selection',
			mandatoryFields: ['mainTopicId'],
			urlParams: ['tid']
		},
		{
			component: 'zipcode',
			urlSuffix: '/zipcode',
			mandatoryFields: ['zipcode'],
			// old links used postcode as parameter
			urlParams: ['postcode']
		},
		{
			component: 'agencySelection',
			urlSuffix: '/agency-selection',
			mandatoryFields: ['agencyId'],
			urlParams: ['aid']
		},
		{
			component: 'accountData',
			urlSuffix: '/account-data',
			mandatoryFields: ['username', 'password']
		}
	];
	const [availableSteps, setAvailableSteps] = useState(defaultSteps);

	const updateSessionStorage = (
		dataToAdd?: Partial<RegistrationSessionStorageData>
	) => {
		const updatedData = {
			...sessionStorageRegistrationData,
			...dataPrepForSessionStorage,
			...dataToAdd
		};

		sessionStorage.setItem(
			registrationSessionStorageKey,
			JSON.stringify(updatedData)
		);
		setSessionStorageRegistrationData(updatedData);
	};

	const refreshSessionStorage = () => {
		setSessionStorageRegistrationData(getSessionStorageData());
	};

	useEffect(() => {
		if (
			urlQuery.get('postcode') ||
			urlQuery.get('aid') ||
			urlQuery.get('tid') ||
			urlQuery.get('cid')
		) {
			const zipcodeRegex = new RegExp(
				/^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/
			);
			const isZipcodeValid = zipcodeRegex.test(urlQuery.get('postcode'));
			setPreselectedData(
				[
					urlQuery.get('postcode') && isZipcodeValid ? 'zipcode' : '',
					urlQuery.get('aid') ? 'aid' : '',
					urlQuery.get('tid') ? 'tid' : ''
				].filter((preselection) => preselection !== '') as (
					| 'tid'
					| 'aid'
					| 'zipcode'
				)[]
			);
			updateSessionStorage({
				zipcode: isZipcodeValid
					? urlQuery.get('postcode')
					: sessionStorageRegistrationData.zipcode,
				agencyId: urlQuery.get('aid')
					? parseInt(urlQuery.get('aid'))
					: sessionStorageRegistrationData.agencyId,
				mainTopicId: urlQuery.get('tid')
					? parseInt(urlQuery.get('tid'))
					: sessionStorageRegistrationData.mainTopicId
			});

			setAvailableSteps(
				availableSteps.filter(
					(step) =>
						!step.urlParams?.every(
							(param) =>
								urlQuery.get(param) &&
								(param !== 'postcode' || isZipcodeValid)
						)
				)
			);
		}
		if (urlQuery.get('cid')) {
			setIsConsultantLink(true);
			(async () => {
				try {
					const consultantResponse = await apiGetConsultant(
						urlQuery.get('cid'),
						true,
						true
					);
					setConsultant(consultantResponse);
				} catch {
					setHasConsultantError(true);
				}
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [urlQuery]);

	useEffect(() => {
		if (sessionStorageRegistrationData.mainTopicId) {
			(async () => {
				try {
					const topicsResponse = await apiGetTopicsData();
					setPreselectedTopic(
						topicsResponse.filter(
							(topic) =>
								topic.id ===
								sessionStorageRegistrationData.mainTopicId
						)[0] || undefined
					);
					setPreselectedTopicName(
						topicsResponse.filter(
							(topic) =>
								topic.id ===
								sessionStorageRegistrationData.mainTopicId
						)[0]?.name || undefined
					);
					if (
						urlQuery.get('tid') &&
						topicsResponse.filter(
							(topic) =>
								topic.id ===
								sessionStorageRegistrationData.mainTopicId
						)[0]?.name === undefined
					) {
						updateSessionStorage({
							mainTopicId: undefined
						});
						setHasTopicError(true);
					}
				} catch {
					setPreselectedTopicName(undefined);
					if (urlQuery.get('tid')) {
						updateSessionStorage({
							mainTopicId: undefined
						});
						setHasTopicError(true);
					}
				}
			})();
		} else {
			setPreselectedTopic(undefined);
			setPreselectedTopicName(undefined);
		}
		if (sessionStorageRegistrationData.agencyId) {
			(async () => {
				try {
					const agencyResponse = await apiGetAgencyById(
						sessionStorageRegistrationData.agencyId
					);
					setPreselectedAgency(agencyResponse || undefined);
				} catch {
					setPreselectedAgency(undefined);
					if (urlQuery.get('aid')) {
						updateSessionStorage({
							agencyId: undefined
						});
						setHasAgencyError(true);
					}
				}
			})();
		} else {
			setPreselectedAgency(undefined);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionStorageRegistrationData]);

	useEffect(() => {
		// readd steps for agency and topic if error in preselection
		if (hasAgencyError || hasTopicError) {
			setAvailableSteps(
				defaultSteps.filter(
					(step) =>
						!step.urlParams?.every(
							(param) =>
								urlQuery.get(param) &&
								(param !== 'aid' || !hasAgencyError) &&
								(param !== 'tid' || !hasTopicError)
						)
				)
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasAgencyError, hasTopicError]);

	useEffect(() => {
		// Check if agency matches preselected topic
		if (
			urlQuery.get('tid') &&
			preselectedTopic &&
			preselectedAgency &&
			!preselectedAgency?.topicIds?.includes(preselectedTopic.id)
		) {
			setPreselectedAgency(undefined);
			updateSessionStorage({
				agencyId: undefined
			});
			setHasAgencyError(true);
		}
		// Check if saved topic matches preselected agency
		if (
			!urlQuery.get('tid') &&
			urlQuery.get('aid') &&
			sessionStorageRegistrationData.mainTopicId &&
			preselectedAgency &&
			!preselectedAgency?.topicIds?.includes(
				sessionStorageRegistrationData.mainTopicId
			)
		) {
			setPreselectedTopic(undefined);
			setPreselectedTopicName(undefined);
			updateSessionStorage({ mainTopicId: undefined });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		preselectedAgency,
		preselectedTopic,
		urlQuery,
		sessionStorageRegistrationData.mainTopicId,
		preselectedTopicName
	]);

	return (
		<RegistrationContext.Provider
			value={{
				disabledNextButton,
				setDisabledNextButton,
				dataPrepForSessionStorage,
				setDataForSessionStorage: setDataPrepForSessionStorage,
				sessionStorageRegistrationData,
				updateSessionStorageWithPreppedData: updateSessionStorage,
				refreshSessionStorageRegistrationData: refreshSessionStorage,
				availableSteps,
				preselectedData,
				preselectedAgency,
				preselectedTopicName,
				isConsultantLink,
				consultant,
				hasConsultantError,
				hasAgencyError,
				hasTopicError
			}}
		>
			{props.children}
		</RegistrationContext.Provider>
	);
}

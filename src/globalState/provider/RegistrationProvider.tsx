import {
	createContext,
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react';
import * as React from 'react';
import { AgencyDataInterface, TopicsDataInterface } from '../interfaces';
import { UrlParamsContext } from './UrlParamsProvider';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { apiGetTopicById } from '../../api/apiGetTopicId';
import { apiGetAgencyById } from '../../api';
import { TopicSelection } from '../../extensions/components/registration/topicSelection/TopicSelection';
import { ZipcodeInput } from '../../extensions/components/registration/zipcodeInput/ZipcodeInput';
import { AgencySelection } from '../../extensions/components/registration/agencySelection/AgencySelection';
import { AccountData } from '../../extensions/components/registration/accountData/AccountData';
import { RouteProps, useRouteMatch } from 'react-router-dom';

export const RegistrationContext = createContext<RegistrationContextInterface>(
	{}
);

interface SessionStorageData {
	username: string;
	password: string;
	agencyId: number;
	mainTopicId: number;
	topicGroupId?: number;
	topicId?: number;
	zipcode: string;
}

export interface RegistrationData extends SessionStorageData {
	agency: AgencyDataInterface;
	mainTopic: TopicsDataInterface;
	topic?: TopicsDataInterface;
}

interface RegistrationContextInterface {
	disabledNextButton?: boolean;
	setDisabledNextButton?: Dispatch<SetStateAction<boolean>>;
	registrationData?: RegistrationData;
	updateRegistrationData?: (data: Partial<RegistrationData>) => void;
	availableSteps?: {
		component: any;
		route: Omit<RouteProps, 'path'> & { path: string };
		name: string;
		//urlSuffix?: string;
		mandatoryFields?: string[];
		urlParams?: string[];
	}[];
	hasConsultantError?: boolean;
	hasAgencyError?: boolean;
	hasTopicError?: boolean;
}

export const registrationSessionStorageKey = 'registrationData';

export function RegistrationProvider({ children }: PropsWithChildren<{}>) {
	const getSessionStorageData = (): SessionStorageData =>
		JSON.parse(
			sessionStorage.getItem(registrationSessionStorageKey) || '{}'
		);
	const setSessionStorageData = (data: Partial<SessionStorageData>) =>
		sessionStorage.setItem(
			registrationSessionStorageKey,
			JSON.stringify(data)
		);

	const { url } = useRouteMatch();

	const [disabledNextButton, setDisabledNextButton] = useState<boolean>(true);
	const [hasTopicError, setHasTopicError] = useState<boolean>(false);
	const [hasAgencyError, setHasAgencyError] = useState<boolean>(false);
	const [hasConsultantError, setHasConsultantError] =
		useState<boolean>(false);
	const [registrationData, setRegistrationData] =
		useState<RegistrationData>();

	const preselectedTopicId = getUrlParameter('tid');
	const preselectedAgencyId = getUrlParameter('aid');
	const preselectedConsultantId = getUrlParameter('cid');
	const {
		loaded,
		agency: preselectedAgency,
		topic: preselectedTopic,
		zipcode: preselectedZipcode,
		consultant: preselectedConsultant
	} = useContext(UrlParamsContext);

	const defaultSteps = useMemo(
		() => [
			{
				component: TopicSelection,
				name: 'topic-selection',
				route: {
					path: `${url}/topic-selection`,
					exact: true
				},
				mandatoryFields: ['mainTopic'],
				condition: ({ topic }) => !!topic
			},
			{
				component: ZipcodeInput,
				name: 'zipcode',
				route: {
					path: `${url}/zipcode`,
					exact: true
				},
				mandatoryFields: ['zipcode'],
				condition: ({ zipcode }) => !!zipcode
			},
			{
				component: AgencySelection,
				name: 'agency-selection',
				route: {
					path: `${url}/agency-selection`,
					exact: true
				},
				mandatoryFields: ['agency'],
				condition: ({ agency }) => !!agency
			},
			{
				component: AccountData,
				name: 'account-data',
				route: {
					path: `/account-data`,
					exact: true
				},
				mandatoryFields: ['username', 'password']
			}
		],
		[url]
	);
	const [availableSteps, setAvailableSteps] = useState(defaultSteps);

	// Init already stored data from session storage
	useEffect(() => {
		(async () => {
			const registrationData =
				getSessionStorageData() as RegistrationData;
			if (registrationData.mainTopicId) {
				registrationData.mainTopic = await apiGetTopicById(
					registrationData.mainTopicId
				);
			}
			if (registrationData.agencyId) {
				// Load agency
				registrationData.agency = await apiGetAgencyById(
					registrationData.agencyId
				);
			}
			if (registrationData.topicId) {
				registrationData.topic = await apiGetTopicById(
					registrationData.topicId
				);
			}
			setRegistrationData(registrationData);
		})();
	}, []);

	const updateRegistrationData = useCallback(
		(data?: Partial<RegistrationData>) => {
			setRegistrationData((registrationData) => ({
				...registrationData,
				...data
			}));
		},
		[]
	);

	useEffect(() => {
		const { topic, mainTopic, agency, ...sessionStorageData } =
			registrationData || {};

		setSessionStorageData({
			...sessionStorageData,
			topicId: topic?.id,
			mainTopicId: mainTopic?.id,
			agencyId: agency?.id
		});
	}, [registrationData]);

	useEffect(() => {
		// Check if agency matches preselected topic
		const hasTopicError = preselectedTopicId && !preselectedTopic;

		// Check if agency matches preselected topic
		const hasAgencyError =
			preselectedAgencyId && preselectedTopic && !preselectedAgency;

		setHasConsultantError(
			preselectedConsultantId && !preselectedConsultant
		);
		setHasTopicError(hasTopicError);
		setHasAgencyError(hasAgencyError);

		updateRegistrationData({
			...(preselectedZipcode ? { zipcode: preselectedZipcode } : {}),
			...(preselectedAgency ? { agency: preselectedAgency } : {}),
			...(preselectedTopic ? { mainTopic: preselectedTopic } : {})
		});

		setAvailableSteps(
			defaultSteps.filter(
				(step) =>
					!step.condition?.({
						agency: preselectedAgency,
						topic: preselectedTopic,
						zipcode: preselectedZipcode
					})
			)
		);
	}, [
		updateRegistrationData,
		preselectedAgencyId,
		preselectedConsultantId,
		preselectedTopicId,
		defaultSteps,
		preselectedTopic,
		preselectedAgency,
		preselectedZipcode,
		preselectedConsultant
	]);

	const context = useMemo(
		() => ({
			disabledNextButton,
			setDisabledNextButton,
			registrationData,
			updateRegistrationData: updateRegistrationData,
			availableSteps,
			hasConsultantError,
			hasAgencyError,
			hasTopicError
		}),
		[
			availableSteps,
			disabledNextButton,
			hasAgencyError,
			hasConsultantError,
			hasTopicError,
			registrationData,
			updateRegistrationData
		]
	);

	if (!loaded) return null;

	return (
		<RegistrationContext.Provider value={context}>
			{children}
		</RegistrationContext.Provider>
	);
}

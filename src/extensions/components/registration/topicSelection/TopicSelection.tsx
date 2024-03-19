import * as React from 'react';
import {
	Typography,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	FormControlLabel,
	Radio,
	RadioGroup,
	FormControl
} from '@mui/material';
import {
	VFC,
	useContext,
	useState,
	useEffect,
	SetStateAction,
	Dispatch,
	useCallback
} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { RegistrationContext, RegistrationData } from '../../../../globalState';
import { apiGetTopicGroups } from '../../../../api/apiGetTopicGroups';
import { apiGetTopicsData } from '../../../../api/apiGetTopicsData';
import {
	TopicsDataInterface,
	TopicGroup
} from '../../../../globalState/interfaces';
import { MetaInfo } from '../metaInfo/MetaInfo';
import { Loading } from '../../../../components/app/Loading';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { REGISTRATION_DATA_VALIDATION } from '../registrationDataValidation';
import { UrlParamsContext } from '../../../../globalState/provider/UrlParamsProvider';

export const TopicSelection: VFC<{
	onChange: Dispatch<SetStateAction<Partial<RegistrationData>>>;
	nextStepUrl: string;
	onNextClick(): void;
}> = ({ onChange, nextStepUrl, onNextClick }) => {
	const { setDisabledNextButton, registrationData } =
		useContext(RegistrationContext);
	const {
		topic: preselectedTopic,
		agency: preselectedAgency,
		consultant: preselectedConsultant
	} = useContext(UrlParamsContext);
	const { t } = useTranslation();
	const [value, setValue] = useState<number>(
		registrationData.mainTopicId || undefined
	);
	const [topicGroups, setTopicGroups] = useState<TopicGroup[]>();
	const [topics, setTopics] = useState<TopicsDataInterface[]>();
	const [listView, setListView] = useState<boolean>(false);
	const [topicGroupId, setTopicGroupId] = useState<number>(
		registrationData.topicGroupId || undefined
	);

	const getTopic = useCallback(
		(mainTopicId: number) =>
			topics?.find((topic) => topic?.id === mainTopicId),
		[topics]
	);

	useEffect(() => {
		if (
			REGISTRATION_DATA_VALIDATION.mainTopicId.validation(
				value?.toString()
			) &&
			(topicGroups?.some((topicGroup) =>
				topicGroup.topicIds.includes(value)
			) ||
				(listView && topics?.some((topic) => topic.id === value)))
		) {
			setDisabledNextButton(false);
		}
	}, [setDisabledNextButton, value, topicGroups, listView, topics]);

	useEffect(() => {
		setListView(!!(preselectedAgency || preselectedConsultant));
	}, [preselectedConsultant, preselectedAgency]);

	useEffect(() => {
		if (topics?.length === 1) {
			setValue(topics[0].id);
			onChange({
				mainTopic: topics[0]
			});
		}
	}, [topics, onChange]);

	useEffect(() => {
		const filterConsultantTopics = (t) =>
			!preselectedConsultant ||
			preselectedConsultant.agencies.some((a) =>
				a.topicIds?.includes(t.id)
			);

		const filterAgencyTopics = (t) =>
			!preselectedAgency || preselectedAgency.topicIds?.includes(t.id);

		const getFilteredTopics = (topics: TopicsDataInterface[]) =>
			topics
				// Filter topic by preselected topic
				.filter(
					(t) => !preselectedTopic || t.id === preselectedTopic?.id
				)
				// Filter topics by consultant topics
				.filter(filterConsultantTopics)
				// Filter topics by preselected agency
				.filter(filterAgencyTopics);
		(async () => {
			setTopics(undefined);
			setTopicGroups(undefined);

			const topicsResponse = await apiGetTopicsData();
			const topics = getFilteredTopics(topicsResponse);
			try {
				const topicIds = topics.map((t) => t.id);
				const topicGroupsResponse = await apiGetTopicGroups();
				//const filer
				setTopicGroups(
					topicGroupsResponse.data.items
						.filter((topicGroup) => topicGroup.topicIds.length > 0)
						.filter((topicGroup) =>
							topicGroup.topicIds.some(topicIds.includes)
						)
						.sort((a, b) => {
							if (a.name === b.name) return 0;
							return a.name < b.name ? -1 : 1;
						})
				);
			} catch {
				setTopicGroups([]);
				setListView(true);
			}

			setTopics(topics);
		})();
	}, [preselectedConsultant, preselectedAgency, preselectedTopic]);

	return (
		<>
			{topics?.length === 1 ? (
				<Typography variant="h3" sx={{ mb: '24px' }}>
					{t('registration.topic.oneResult')}
				</Typography>
			) : (
				<>
					<Typography variant="h3">
						{t('registration.topic.headline')}
					</Typography>
					<Typography sx={{ mt: '16px', mb: '24px' }}>
						{t('registration.topic.subline')}
					</Typography>
				</>
			)}
			{topics === undefined || topicGroups === undefined ? (
				<Box
					sx={{
						mt: '80px',
						width: '100%',
						display: 'flex',
						justifyContent: 'center'
					}}
				>
					<Loading />
				</Box>
			) : (
				<FormControl sx={{ width: '100%' }}>
					<RadioGroup
						aria-label="topic-selection"
						name="topic-selection"
						data-cy={`topic-radio-group`}
						defaultValue={topics.length === 1 ? topics[0].id : ''}
					>
						{listView
							? (topics || [])
									.sort((a, b) => {
										if (a.name === b.name) return 0;
										return a.name < b.name ? -1 : 1;
									})
									.map((topic, index) => (
										<TopicSelect
											key={`${topic.id}`}
											topics={topics}
											index={index}
											topic={topic}
											nextStepUrl={nextStepUrl}
											onNextClick={onNextClick}
											checked={value === topic?.id}
											onOverlayClose={() =>
												setValue(undefined)
											}
											onOverlayOpen={() =>
												setValue(topic.id)
											}
											onChange={() => {
												setValue(topic.id);
												onChange({
													mainTopic: topic
												});
											}}
										/>
									))
							: (topicGroups || []).map((topicGroup) => (
									<Accordion
										data-cy={`topic-group-${topicGroup.id}`}
										key={`topicGroup-${topicGroup.id}`}
										defaultExpanded={
											topicGroup.topicIds.includes(
												value
											) && topicGroup.id === topicGroupId
										}
										sx={{
											'boxShadow': 'none',
											'borderBottom': '1px solid #dddddd',
											'borderRadius': '4px',
											'&:before': {
												display: 'none'
											},
											'& .MuiAccordionSummary-root:hover':
												{
													backgroundColor:
														'primary.lighter'
												},
											'&.Mui-expanded': {
												margin: 0
											}
										}}
									>
										<AccordionSummary
											expandIcon={
												<ExpandMoreIcon
													color="info"
													sx={{
														p: '6px',
														width: '42px',
														height: '42px'
													}}
												/>
											}
											aria-controls={`panel-${topicGroup.name}-content`}
											id={`panel-${topicGroup.name}`}
											sx={{
												'& .MuiAccordionSummary-content.Mui-expanded':
													{
														m: '12px 0'
													}
											}}
										>
											<Typography
												variant="h4"
												sx={{
													lineHeight: '28px',
													fontWeight: '400',
													py: '12px'
												}}
											>
												{topicGroup.name}
											</Typography>
										</AccordionSummary>
										<AccordionDetails
											sx={{ pt: 0 }}
											data-cy={`topic-group-${topicGroup.id}-topic-selection-radio-group`}
										>
											{topicGroup.topicIds
												.map((t) => getTopic(t))
												.filter(Boolean)
												.sort((a, b) => {
													if (a.name === b.name)
														return 0;
													return a.name < b.name
														? -1
														: 1;
												})
												.map((topic, index) => (
													<TopicSelect
														key={`${topicGroup.id}-${topic.id}`}
														topics={topics}
														index={index}
														topic={topic}
														nextStepUrl={
															nextStepUrl
														}
														onNextClick={
															onNextClick
														}
														onOverlayClose={() => {
															setValue(undefined);
															setTopicGroupId(
																undefined
															);
														}}
														onOverlayOpen={() => {
															setValue(topic.id);
															setTopicGroupId(
																topicGroup.id
															);
														}}
														checked={
															value ===
																topic.id &&
															topicGroup.id ===
																topicGroupId
														}
														onChange={() => {
															setValue(topic.id);
															setTopicGroupId(
																topicGroup.id
															);
															onChange({
																mainTopic:
																	topic,
																topicGroupId:
																	topicGroup?.id
															});
														}}
													/>
												))}
										</AccordionDetails>
									</Accordion>
								))}
					</RadioGroup>
				</FormControl>
			)}
		</>
	);
};

const TopicSelect = ({
	topics,
	topic,
	index,
	nextStepUrl,
	onNextClick,
	onChange,
	onOverlayClose,
	onOverlayOpen,
	checked
}) => {
	const { t } = useTranslation();

	return (
		<Box
			key={topic.id}
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				width: '100%',
				mt: index === 0 ? '0' : '16px'
			}}
		>
			<FormControlLabel
				data-cy={`topic-selection-radio-${topic.id}`}
				disabled={topics.length === 1}
				sx={{
					alignItems: 'flex-start'
				}}
				value={topic?.id}
				control={
					<Radio
						onClick={onChange}
						checked={checked}
						checkedIcon={
							topics.length === 1 ? (
								<TaskAltIcon color="info" />
							) : undefined
						}
						icon={
							topics.length === 1 ? (
								<TaskAltIcon color="info" />
							) : undefined
						}
					/>
				}
				label={
					<Box
						sx={{
							mt: '10px',
							ml: '10px'
						}}
					>
						<Typography variant="body1">{topic?.name}</Typography>
					</Box>
				}
			/>
			{topic?.description && (
				<MetaInfo
					headline={topic.name}
					description={topic.description}
					backButtonLabel={t(
						'registration.topic.infoOverlay.backButtonLabel'
					)}
					nextButtonLabel={t(
						'registration.topic.infoOverlay.nextButtonLabel'
					)}
					nextStepUrl={nextStepUrl}
					onNextClick={onNextClick}
					onOverlayClose={() => onOverlayClose(topic)}
					onOverlayOpen={() => onOverlayOpen(topic)}
				/>
			)}
		</Box>
	);
};

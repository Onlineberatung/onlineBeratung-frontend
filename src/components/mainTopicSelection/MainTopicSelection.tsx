import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import './MainTopicSelection.styles';
import { apiGetTopicsData } from '../../api/apiGetTopicsData';
import { RadioButton } from '../radioButton/RadioButton';
import { InfoTooltip } from '../infoTooltip/InfoTooltip';
import {
	VALIDITY_VALID,
	VALIDITY_INVALID
} from '../registration/registrationHelpers';
import { useTranslation } from 'react-i18next';
import { TopicsDataInterface } from '../../globalState/interfaces/TopicsDataInterface';

export interface MainTopicSelectionProps {
	name: string;
	value: TopicsDataInterface | null;
	onChange: (value: TopicsDataInterface) => void;
	onValidityChange: (key: string, value: string) => void;
}

export const MainTopicSelection = ({
	name,
	value,
	onChange,
	onValidityChange
}: MainTopicSelectionProps) => {
	const { t: translate } = useTranslation();

	const [topics, setTopics] = useState([]);
	const [isTouched, setIsTouched] = useState(false);

	useEffect(() => {
		apiGetTopicsData().then((data) => setTopics(data));
	}, []);

	useEffect(() => {
		if (!isTouched) return;

		onValidityChange(name, value ? VALIDITY_VALID : VALIDITY_INVALID);
	}, [isTouched, name, onValidityChange, value]);

	const handleChange = useCallback(
		(topic: TopicsDataInterface) => {
			setIsTouched(true);
			onChange(topic);
		},
		[onChange]
	);

	// If options change, check for still valid preselected topic
	useEffect(() => {
		if (!value || topics.some((t) => t.id === value.id)) {
			return;
		}
		onChange(null);
	}, [onChange, topics, value]);

	return (
		<div className="mainTopicSelection">
			{topics.length === 0 && (
				<h3 className="mainTopicSelection__info">
					{translate('registration.mainTopic.noTopics')}
				</h3>
			)}
			{topics.map((topic) => {
				const { id, name } = topic;
				return (
					<div className="mainTopicSelection__topic" key={id}>
						<RadioButton
							className="mainTopicSelection__radioButton"
							name="topicSelection"
							type="smaller"
							handleRadioButton={() => handleChange(topic)}
							value={id}
							checked={value?.id === id}
							inputId={`${name
								.toLowerCase()
								.replace(' ', '-')}-${id}`}
						>
							{name}
						</RadioButton>
						<InfoTooltip
							translation={{
								ns: 'topics',
								prefix: 'topic'
							}}
							info={topic}
						/>
					</div>
				);
			})}
		</div>
	);
};

import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import './MainTopicSelection.styles';
import { apiGetTopicsData } from '../../api/apiGetTopicsData';
import { RadioButton } from '../radioButton/RadioButton';
import { AgencyInfo } from '../agencySelection/AgencyInfo';
import {
	VALIDITY_VALID,
	VALIDITY_INITIAL
} from '../registration/registrationHelpers';
import { useTranslation } from 'react-i18next';
import { useLocaleData } from '../../globalState';

export interface MainTopicSelectionProps {
	name: string;
	preselectedTopic: any;
	onChange: (value: string) => void;
	onValidityChange: (key: string, value: string) => void;
}

export const MainTopicSelection = ({
	name,
	preselectedTopic,
	onChange,
	onValidityChange
}: MainTopicSelectionProps) => {
	const { locale } = useLocaleData();
	const { t: translate } = useTranslation();
	const [topics, setTopics] = useState([]);
	const [selectedTopic, setSelectedTopic] = useState(preselectedTopic);

	useEffect(() => {
		apiGetTopicsData().then((data) => setTopics(data));
		onValidityChange(
			name,
			selectedTopic >= 0 ? VALIDITY_VALID : VALIDITY_INITIAL
		);
	}, [name, locale]); // eslint-disable-line react-hooks/exhaustive-deps

	const onChangeInput = useCallback(
		(value) => {
			setSelectedTopic(value);
			onChange(value);
			onValidityChange(name, value ? VALIDITY_VALID : VALIDITY_INITIAL);
		},
		[name, onValidityChange, onChange]
	);

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
							handleRadioButton={() =>
								onChangeInput(id.toString())
							}
							value={id.toString()}
							checked={selectedTopic === id}
							inputId={`${name
								.toLowerCase()
								.replace(' ', '-')}-${id}`}
							label={name}
						/>
						<AgencyInfo agency={topic} />
					</div>
				);
			})}
		</div>
	);
};

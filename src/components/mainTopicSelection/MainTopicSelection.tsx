import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import './MainTopicSelection.styles';
import { translate } from '../../utils/translate';
import { apiGetTopicsData } from '../../api/apiGetTopicsData';
import { RadioButton } from '../radioButton/RadioButton';
import { AgencyInfo } from '../agencySelection/AgencyInfo';
import {
	VALIDITY_VALID,
	VALIDITY_INITIAL
} from '../registration/registrationHelpers';

export interface MainTopicSelectionProps {
	name: string;
	onChange: (value: string) => void;
	onValidityChange: (key: string, value: string) => void;
}

export const MainTopicSelection = ({
	name,
	onChange,
	onValidityChange
}: MainTopicSelectionProps) => {
	const [topics, setTopics] = useState([]);
	const [selectedTopic, setSelectedTopic] = useState(null);

	useEffect(() => {
		apiGetTopicsData().then((data) => setTopics(data));
		onValidityChange(name, VALIDITY_INITIAL);
	}, [name]); // eslint-disable-line react-hooks/exhaustive-deps

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
			<h3 className="mainTopicSelection__info">
				{translate('registration.mainTopic.subline')}
			</h3>
			{topics.map((t) => (
				<div className="mainTopicSelection__topic" key={t.id}>
					<RadioButton
						className="mainTopicSelection__radioButton"
						name="topicSelection"
						type="smaller"
						handleRadioButton={() => onChangeInput(t.id.toString())}
						value={t.id.toString()}
						checked={selectedTopic === t.id}
						inputId={t.name.toLowerCase().replace(' ', '-')}
						label={t.name}
					/>
					<AgencyInfo agency={t} />
				</div>
			))}
		</div>
	);
};

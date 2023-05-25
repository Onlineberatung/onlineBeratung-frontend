import React from 'react';
import { Meta } from '@storybook/react';

import { TopicSelection } from './topicSelection';

export default {
	title: 'Registration/TopicSelection',
	component: TopicSelection
} as Meta<typeof TopicSelection>;

export const Default = {
	args: {
		view: {
			options: ['showResults', 'loading', 'noResults', 'oneResult'],
			control: { type: 'select' }
		}
	}
};

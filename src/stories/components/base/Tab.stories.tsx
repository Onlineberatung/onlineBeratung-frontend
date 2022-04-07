import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
	Tab,
	SELECT_TAB1,
	SELECT_TAB2,
	SELECT_TAB3,
	SELECT_TAB4
} from '../../../components/base/Tab';

export default {
	title: 'Base/Tab',
	component: Tab
} as ComponentMeta<typeof Tab>;

const Template: ComponentStory<typeof Tab> = (args) => <Tab {...args} />;

export const Default = Template.bind({});
Default.args = {
	selection: SELECT_TAB1,
	tabPanel1: 'Tab lorem',
	tabPanel2: 'Tab lorem',
	tabPanel3: 'Tab lorem',
	tabPanel4: 'Tab lorem',
	tabPanel5: '',
	tabPanel6: ''
};

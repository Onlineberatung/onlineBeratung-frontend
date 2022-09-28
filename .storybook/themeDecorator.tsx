import React from 'react';
import theme from '../config/caritas';
import { Theme } from '../src/globalState/provider/Theme';

const ThemeDecorator = (storyFn) => <Theme>{storyFn()}</Theme>;

export default ThemeDecorator;

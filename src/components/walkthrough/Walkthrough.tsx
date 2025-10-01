import 'intro.js/introjs.css';
import './walkthrough.styles.scss';

import * as React from 'react';
import { useContext } from 'react';

import { UserDataContext } from '../../globalState';
import { WalkthroughAdviceSeeker } from './WalkthroughAdviceSeeker';
import { WalkthroughConsultant } from './WalkthroughConsultant';

export const Walkthrough = () => {
	const { userData } = useContext(UserDataContext);

	if (!userData?.userRoles) {
		return null;
	}

	if (userData.userRoles.includes('user')) {
		return <WalkthroughAdviceSeeker />;
	} else if (userData.userRoles.includes('consultant')) {
		return <WalkthroughConsultant />;
	} else {
		return null;
	}
};

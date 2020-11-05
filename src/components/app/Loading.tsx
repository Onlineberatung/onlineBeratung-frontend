import * as React from 'react';
import { useState } from 'react';

export const Loading = () => {
	// show loading spinner after 500ms
	const [hide, setHide] = useState(true);
	setTimeout(() => setHide(false), 500);

	return (
		<div className="loading__spinnerWrapper ">
			<div
				className={`loading__spinner ${
					hide ? 'loading__spinner--hide' : null
				}`}
			>
				<div className="double-bounce1"></div>
				<div className="double-bounce2"></div>
			</div>
		</div>
	);
};

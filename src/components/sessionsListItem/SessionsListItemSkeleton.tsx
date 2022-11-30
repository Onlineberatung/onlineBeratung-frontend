import * as React from 'react';
import './sessionsListItem.styles';

export const SessionsListSkeleton = () => {
	return (
		<div className="sessionsListItem skeleton">
			<div className="sessionsListItem__content" tabIndex={2}>
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__consultingType skeleton__item"></div>
				</div>
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__icon skeleton__item"></div>
					<div className="sessionsListItem__username skeleton__item"></div>
				</div>
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__subject skeleton__item"></div>
					<div className="sessionsListItem__date skeleton__item"></div>
				</div>
			</div>
		</div>
	);
};

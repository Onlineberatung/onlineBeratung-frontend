import * as React from 'react';
import {
	UserDataProvider,
	AuthDataProvider,
	SessionsDataProvider,
	ActiveSessionGroupIdProvider,
	FilterStatusProvider,
	ConsultantListProvider,
	AcceptedGroupIdProvider,
	UnreadSessionsStatusProvider,
	StoppedGroupChatProvider
} from '.';

function ProviderComposer({ contexts, children }) {
	return contexts.reduceRight(
		(children, parent) =>
			React.cloneElement(parent, {
				children: children
			}),
		children
	);
}

function ContextProvider({ children }) {
	return (
		<ProviderComposer
			contexts={[
				<UserDataProvider />,
				<AuthDataProvider />,
				<SessionsDataProvider />,
				<ActiveSessionGroupIdProvider />,
				<FilterStatusProvider />,
				<ConsultantListProvider />,
				<AcceptedGroupIdProvider />,
				<UnreadSessionsStatusProvider />,
				<StoppedGroupChatProvider />
			]}
		>
			{children}
		</ProviderComposer>
	);
}

export { ContextProvider };

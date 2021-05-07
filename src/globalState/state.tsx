import * as React from 'react';
import {
	AcceptedGroupIdProvider,
	ActiveSessionGroupIdProvider,
	AuthDataProvider,
	ConsultantListProvider,
	FilterStatusProvider,
	NotificationsProvider,
	SessionsDataProvider,
	StoppedGroupChatProvider,
	UnreadSessionsStatusProvider,
	UserDataProvider
} from '.';
import { ConsultingTypesProvider } from './provider/ConsultingTypesProvider';

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
				<AcceptedGroupIdProvider />,
				<ActiveSessionGroupIdProvider />,
				<AuthDataProvider />,
				<ConsultantListProvider />,
				<FilterStatusProvider />,
				<NotificationsProvider />,
				<SessionsDataProvider />,
				<StoppedGroupChatProvider />,
				<UnreadSessionsStatusProvider />,
				<UserDataProvider />,
				<ConsultingTypesProvider />
			]}
		>
			{children}
		</ProviderComposer>
	);
}

export { ContextProvider };

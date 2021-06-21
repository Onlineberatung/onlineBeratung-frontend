import * as React from 'react';
import {
	AcceptedGroupIdProvider,
	ActiveSessionGroupIdProvider,
	AnonymousConversationFinishedProvider,
	AnonymousEnquiryAcceptedProvider,
	AuthDataProvider,
	ConsultantListProvider,
	ConsultingTypesProvider,
	FilterStatusProvider,
	NotificationsProvider,
	SessionsDataProvider,
	StoppedGroupChatProvider,
	UnreadSessionsStatusProvider,
	UpdateAnonymousEnquiriesProvider,
	UpdateSessionListProvider,
	UserDataProvider
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
				<AcceptedGroupIdProvider />,
				<ActiveSessionGroupIdProvider />,
				<AnonymousConversationFinishedProvider />,
				<AnonymousEnquiryAcceptedProvider />,
				<AuthDataProvider />,
				<ConsultantListProvider />,
				<FilterStatusProvider />,
				<NotificationsProvider />,
				<SessionsDataProvider />,
				<StoppedGroupChatProvider />,
				<UnreadSessionsStatusProvider />,
				<UpdateAnonymousEnquiriesProvider />,
				<UpdateSessionListProvider />,
				<UserDataProvider />,
				<ConsultingTypesProvider />
			]}
		>
			{children}
		</ProviderComposer>
	);
}

export { ContextProvider };

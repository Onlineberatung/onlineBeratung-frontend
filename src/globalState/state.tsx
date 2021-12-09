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
	UpdateSessionListProvider,
	UserDataProvider,
	WebsocketConnectionDeactivatedProvider,
	ThemeProvider
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
				<ConsultingTypesProvider />,
				<FilterStatusProvider />,
				<NotificationsProvider />,
				<SessionsDataProvider />,
				<StoppedGroupChatProvider />,
				<UnreadSessionsStatusProvider />,
				<UpdateSessionListProvider />,
				<UserDataProvider />,
				<WebsocketConnectionDeactivatedProvider />,
				<ThemeProvider />
			]}
		>
			{children}
		</ProviderComposer>
	);
}

export { ContextProvider };

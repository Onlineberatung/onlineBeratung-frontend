import * as React from 'react';
import {
	AnonymousConversationFinishedProvider,
	AnonymousEnquiryAcceptedProvider,
	ConsultantListProvider,
	ConsultingTypesProvider,
	NotificationsProvider,
	UpdateSessionListProvider,
	UserDataProvider,
	WebsocketConnectionDeactivatedProvider,
	RocketChatGlobalSettingsProvider,
	AnonymousConversationStartedProvider,
	SessionsDataProvider,
	ModalProvider,
	AgencySpecificProvider
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
				<AnonymousEnquiryAcceptedProvider />,
				<AnonymousConversationStartedProvider />,
				<ConsultantListProvider />,
				<ConsultingTypesProvider />,
				<NotificationsProvider />,
				<UpdateSessionListProvider />,
				<UserDataProvider />,
				<AgencySpecificProvider />,
				<AnonymousConversationFinishedProvider />,
				<WebsocketConnectionDeactivatedProvider />,
				<SessionsDataProvider />,
				<RocketChatGlobalSettingsProvider />,
				<ModalProvider />
			]}
		>
			{children}
		</ProviderComposer>
	);
}

export { ContextProvider };

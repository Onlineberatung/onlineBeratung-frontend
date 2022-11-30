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
	TenantProvider,
	RocketChatGlobalSettingsProvider,
	AnonymousConversationStartedProvider,
	SessionsDataProvider,
	InformalProvider,
	ModalProvider
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
				<AnonymousConversationFinishedProvider />,
				<WebsocketConnectionDeactivatedProvider />,
				<TenantProvider />,
				<SessionsDataProvider />,
				<RocketChatGlobalSettingsProvider />,
				<InformalProvider />,
				<ModalProvider />
			]}
		>
			{children}
		</ProviderComposer>
	);
}

export { ContextProvider };

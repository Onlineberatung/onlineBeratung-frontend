import * as React from 'react';
import { createContext, useState } from 'react';

export const AnonymousEnquiryAcceptedContext = createContext<any>(null);

export function AnonymousEnquiryAcceptedProvider(props) {
	const [anonymousEnquiryAccepted, setAnonymousEnquiryAccepted] =
		useState(null);

	return (
		<AnonymousEnquiryAcceptedContext.Provider
			value={{ anonymousEnquiryAccepted, setAnonymousEnquiryAccepted }}
		>
			{props.children}
		</AnonymousEnquiryAcceptedContext.Provider>
	);
}

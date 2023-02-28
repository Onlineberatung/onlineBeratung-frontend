import * as React from 'react';
import { createContext, FC, useState } from 'react';

export const AnonymousEnquiryAcceptedContext = createContext<any>(null);

export const AnonymousEnquiryAcceptedProvider: FC = ({ children }) => {
	const [anonymousEnquiryAccepted, setAnonymousEnquiryAccepted] =
		useState(null);

	return (
		<AnonymousEnquiryAcceptedContext.Provider
			value={{ anonymousEnquiryAccepted, setAnonymousEnquiryAccepted }}
		>
			{children}
		</AnonymousEnquiryAcceptedContext.Provider>
	);
};
